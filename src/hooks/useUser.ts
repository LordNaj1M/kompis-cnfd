// src/hooks/useUser.ts
import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import { useToast } from '@chakra-ui/react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserApiResponse {
  data: User;
  message?: string;
}

interface UsersApiResponse {
  data: User[];
  message?: string;
}

interface ApiErrorResponse {
  message: string;
  status?: number;
}

// Fungsi fetcher untuk data user tunggal
const userFetcher = async (url: string): Promise<User> => {
  const response = await axiosInstance.get<UserApiResponse>(url);
  return response.data.data;
};

// Fungsi fetcher untuk data semua users
const usersFetcher = async (url: string): Promise<User[]> => {
  const response = await axiosInstance.get<UsersApiResponse>(url);
  return response.data.data;
};

// Hook untuk mendapatkan data user yang sedang login
export const useUser = () => {
  const toast = useToast();

  const { data, error, mutate } = useSWR<User>('/users/profile', userFetcher, {
    // refreshInterval: 300000, 
    errorRetryCount: 3,
    revalidateOnFocus: true,

    // Gunakan data dari localStorage sebagai fallback
    fallbackData: localStorage.getItem('userData') 
    ? JSON.parse(localStorage.getItem('userData') || '{}')
    : undefined,
    onSuccess: (data) => {
      localStorage.setItem("userData", JSON.stringify(data));
    },
    onError: (error) => {
      if(error.response?.data.message === "jwt expired") {
        return error;
      } else {
        toast({
          title: "ERROR",
          description: `Request Error: ${error.response?.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  });

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useUsers = () => {
  const { data, error, mutate } = useSWR<User[]>('/admin/users', usersFetcher, {
    // refreshInterval: 300000,   
    errorRetryCount: 3,
    revalidateOnFocus: true,
  });

  const sortedUsers = data ? [...data].sort((a, b) => a.id.localeCompare(b.id)) : [];

  return {
    users: sortedUsers || [],
    isLoading: !error && !sortedUsers,
    isError: error,
    mutate,
  };
};

export const useUserById = (userId: string) => {
  const { data, error, mutate } = useSWR<User>(`/admin/users/${userId}`, userFetcher, {
    // refreshInterval: 300000,    
    errorRetryCount: 3,    
    revalidateOnFocus: true,
  });

  const userById = data;

  return {
    user: userById,
    isLoading: !error && !userById,
    isError: error,
    mutate,
  };
};

export const editProfile = async (
  data: { name?: string; email?: string }
) => {
  try {
    const response = await axiosInstance.patch('/users/profile', data);

    // Update localStorage dengan data baru
    const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUserData = { ...currentUserData, ...data };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));

    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Error editing profile!');
  }
};

export const editPassword = async (
  data: { oldPassword: string; newPassword: string }
) => {
  try {
    const response = await axiosInstance.patch('/users/editPassword', data);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to update password!');
  }
};

export const editProfileByAdmin = async (
  userId: string, 
  data: { passwordAdmin?:string; name?: string; email?: string }
) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}`, data);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to editing user profile!');
  }
};

export const editPasswordByAdmin = async (
  userId: string, 
  data: { passwordAdmin?:string; newUserPassword?: string; }
) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/editPassword`, data);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to editing user password!');
  }
};

export const deleteUserByAdmin = async (
  userId: string
) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to deleting user!');
  }
};