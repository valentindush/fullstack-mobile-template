import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../axios.config';
import useStorage from '@/hooks/useStorage';

interface User {
  id: string
  fullName: string
  email: string
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { storeData, getData, removeData } = useStorage();

  const API_URL = 'http://10.5.222.22:3000'; // Replace with your API URL

  useEffect(() => {
    // Check if the user is already logged in
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await getData('authToken');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { accessToken, refreshToken, user } = response.data;
      await storeData('accessToken', accessToken);
      await storeData('refreshToken', refreshToken);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
      const { accessToken, refreshToken, user } = response.data;
      await storeData('accessToken', accessToken);
      await storeData('refreshToken', refreshToken);
      setUser(user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeData('accessToken');
      await removeData('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};