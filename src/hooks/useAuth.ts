// src/hooks/useAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ApiErrorResponse {
    message: string;
    status?: number;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { token, data: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/');
      return true;
    } catch (e) {
        const error = e as AxiosError<ApiErrorResponse>;
        setError(error.response?.data?.message || 'Login failed. Please try again.');
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; security_answer: string }) => {
    setIsLoading(true);
    setError('');
    try {
      await axiosInstance.post('/register', data);
      return true;
    } catch (e) {
        const error = e as AxiosError<ApiErrorResponse>;
        setError(error.response?.data?.message || 'Registration failed. Please try again.');
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const resetPassword = async (data: { email: string; newPassword: string; security_answer: string }) => {
    setIsLoading(true);
    setError('');
    try {
      await axiosInstance.patch('/resetPassword', data);
      return true;
    } catch (e) {
        const error = e as AxiosError<ApiErrorResponse>;
        setError(error.response?.data?.message || 'Password reset failed. Please try again.');
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setError('');
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return true;
    } catch (e) {
        setError("Error: " + e || 'Logout failed. Please try again.');
        return false;
    } finally {
        navigate('/login');
        setIsLoading(false);
    }
  };

  return {
    login,
    register,
    resetPassword,
    logout,
    isLoading,
    error,
    setError
  };
};