import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import TouchableButton from "@/components/CustomButton"
import CustomInput from "@/components/CustomInput"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useAuth } from "@/utils/providers/auth.provider"
import { Feather } from "@expo/vector-icons"
import { Link, router } from "expo-router"
import twrnc from "twrnc"

interface FormValues {
    email: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const Login = () => {
    const { login } = useAuth();

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        try {
            await login(values.email, values.password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'You have successfully logged in',
            });
            router.replace('/')
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemedView style={twrnc`flex-1 p-4 flex items-center justify-center`}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <ThemedView style={twrnc`flex flex-col gap-6 w-full px-5`}>
                        <ThemedView style={twrnc`items-center flex flex-col`}>
                            <ThemedText style={twrnc`text-2xl font-bold`}>Sign In</ThemedText>
                            <ThemedText style={twrnc`text-lg`}>Enter your credentials to continue</ThemedText>
                        </ThemedView>
                        <ThemedView style={twrnc`flex flex-col gap-3`}>
                            <ThemedView>
                                <CustomInput
                                    LeftIcon={Feather}
                                    iconProps={{ name: 'mail', size: 24, color: 'gray' }}
                                    placeholder="Email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    inputMode='email'
                                />
                                {touched.email && errors.email && (
                                    <ThemedText style={twrnc`text-red-400 text-sm mt-1`}>{errors.email}</ThemedText>
                                )}
                            </ThemedView>
                            <ThemedView>
                                <CustomInput
                                    LeftIcon={Feather}
                                    iconProps={{ name: 'lock', size: 24, color: 'gray' }}
                                    placeholder="Password"
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <ThemedText style={twrnc`text-red-400 text-sm mt-1`}>{errors.password}</ThemedText>
                                )}
                                <ThemedText style={twrnc`ml-auto mr-2 mt-1 text-sm text-gray-600 dark:text-white`}>Forgot password?</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView>
                            <TouchableButton 
                                title="Continue" 
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            />
                            <ThemedView style={twrnc`flex flex-row gap-2 justify-center mt-2`}>
                                <ThemedText style={twrnc`text-sm text-gray-600 dark:text-white`}>Don't have account?</ThemedText>
                                <Link href={'/register'} style={twrnc`text-sm text-[#615EFC] dark:text-white`}>Create one</Link>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}
            </Formik>
            <Toast />
        </ThemedView>
    )
}

export default Login