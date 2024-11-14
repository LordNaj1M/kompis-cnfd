import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';

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
  const { data, error, mutate } = useSWR<User>('/users/profile', userFetcher, {
    // Refresh data setiap 5 menit=> refreshInterval: 300000,
    // Coba lagi jika gagal=>      
    errorRetryCount: 3,    
    // Memvalidasi ulang jika halaman ter-fokus-kan=> revalidateOnFocus: true,

    // Gunakan data dari localStorage sebagai fallback
    fallbackData: localStorage.getItem('userData') 
      ? JSON.parse(localStorage.getItem('userData') || '{}')
      : undefined,
    onError: (error) => {
      console.error("Request Error:", error);
      if (error.response?.status === 400) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
  });
  
  console.log('useUser data:', data);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useUsers = () => {
  const { data, error, mutate } = useSWR<User[]>('/admin/users', usersFetcher, {
    // Refresh data setiap 5 menit=> refreshInterval: 300000,
    // Coba lagi jika gagal=>      
    errorRetryCount: 3,    
    // Memvalidasi ulang jika halaman ter-fokus-kan=> revalidateOnFocus: true,
  });

  const sortedUsers = data ? [...data].sort((a, b) => a.id.localeCompare(b.id)) : [];

  return {
    users: sortedUsers || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};