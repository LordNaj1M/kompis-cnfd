// src/hooks/useAuth.ts
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

  const login = async (
    email: string, password: string
  ) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      const { token, data: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      return response.data;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const register = async (
    data: { name: string; email: string; password: string; security_answer: string }
  ) => {
    try {
      const response = await axiosInstance.post('/register', data);
      return response;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const resetPassword = async (
    data: { email: string; newPassword: string; security_answer: string }
  ) => {
    try {
      const response = await axiosInstance.patch('/resetPassword', data);
      return response;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(error.response?.data?.message || 'Password reset failed. Please try again.');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return true;
    } catch {
        throw new Error('Logout failed. Please try again.');
    } finally {
        navigate('/login');
    }
  };

  return {
    login,
    register,
    resetPassword,
    logout
  };
};