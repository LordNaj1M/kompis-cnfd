import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ApiResponse {
  data: User;
  message?: string;
}

// Fungsi fetcher untuk SWR
const fetcher = async (url: string) => {
    const response = await axiosInstance.get<ApiResponse>(url);
    return response.data.data || response.data;
  };

// Hook untuk mendapatkan data user yang sedang login
export const useUser = () => {
  const { data, error, mutate } = useSWR<User>('/users/profile', fetcher, {
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

/*
// Hook untuk mendapatkan data semua users (untuk admin)
export const useUsers = () => {
  const { data, error, mutate } = useSWR<User[]>('/admin/users', fetcher);

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// Hook untuk mendapatkan data user spesifik by ID
export const useUserById = (id: string) => {
  const { data, error, mutate } = useSWR<User>(
    id ? `/admin/users/${id}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
*/