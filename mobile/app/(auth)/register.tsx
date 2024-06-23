import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import TouchableButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/utils/providers/auth.provider";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import twrnc from "twrnc";

interface FormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const { signup } = useAuth();

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        try {
            await signup(values.email, values.password, values.fullName);
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'You have successfully created an account',
            });
            router.replace('/')
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ThemedView style={twrnc`flex-1 p-4 flex items-center justify-center`}>
            <Formik
                initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <ThemedView style={twrnc`flex flex-col gap-6 w-full px-5`}>
                        <ThemedView style={twrnc`items-center flex flex-col`}>
                            <ThemedText style={twrnc`text-2xl font-bold`}>Create account</ThemedText>
                            <ThemedText style={twrnc`text-lg`}>Create a new Electra account</ThemedText>
                        </ThemedView>
                        <ThemedView style={twrnc`flex flex-col gap-3`}>
                            <ThemedView>
                                <CustomInput
                                    LeftIcon={Feather}
                                    iconProps={{ name: 'user', size: 24, color: 'gray' }}
                                    placeholder="Full Name"
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />
                                {touched.fullName && errors.fullName && (
                                    <ThemedText style={twrnc`text-red-400 text-sm mt-1`}>{errors.fullName}</ThemedText>
                                )}
                            </ThemedView>
                            <ThemedView>
                                <CustomInput
                                    LeftIcon={Feather}
                                    iconProps={{ name: 'mail', size: 24, color: 'gray' }}
                                    placeholder="Email"
                                    inputMode="email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
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
                            </ThemedView>
                            <ThemedView>
                                <CustomInput
                                    LeftIcon={Feather}
                                    iconProps={{ name: 'lock', size: 24, color: 'gray' }}
                                    placeholder="Confirm Password"
                                    secureTextEntry
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <ThemedText style={twrnc`text-red-400 text-sm mt-1`}>{errors.confirmPassword}</ThemedText>
                                )}
                            </ThemedView>
                        </ThemedView>
                        <ThemedView>
                            <TouchableButton
                                title="Sign Up"
                                onPress={()=>handleSubmit()}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            />
                            <ThemedView style={twrnc`flex flex-row gap-2 justify-center mt-2`}>
                                <ThemedText style={twrnc`text-sm text-gray-600 dark:text-white`}>Already have account?</ThemedText>
                                <Link href={'/login'} style={twrnc`text-sm text-[#615EFC] dark:text-white`}>Login</Link>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}
            </Formik>
            <Toast />
        </ThemedView>
    );
};

export default Register;