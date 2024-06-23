import useStorage from '@/hooks/useStorage';
import axios from 'axios';

const API_URL = 'http://10.5.222.22:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const {getData, storeData} = useStorage()

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getData('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await getData('refreshToken');
      if (refreshToken) {
        try { 
          const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

          const { accessToken } = response.data;
          await storeData('accessToken', accessToken);

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
