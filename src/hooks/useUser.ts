import { useState, useEffect } from 'react';
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

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>(() => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : undefined;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!user);
  const [isError, setIsError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<ApiResponse>('/users/profile');
      const userData = response.data.data || response.data;
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsError(null);
    } catch (error) {
      console.error("Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    const intervalId = setInterval(fetchUser, 300000); // Refresh every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return {
    user,
    isLoading,
    isError,
    refetch: fetchUser,
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