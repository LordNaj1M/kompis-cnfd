// src/hooks/useArea.ts
import useSWR from 'swr';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';

export interface Area {
  id: string;
  name: string;
  capacity: number;
}

interface AreaApiResponse {
  data: Area;
  message?: string;
}

interface AreasApiResponse {
  data: Area[];
  message?: string;
}

interface ApiErrorResponse {
  message: string;
  status?: number;
}

// Fungsi fetcher untuk data user tunggal
const areaFetcher = async (url: string): Promise<Area> => {
  const response = await axiosInstance.get<AreaApiResponse>(url);
  return response.data.data;
};

// Fungsi fetcher untuk data semua users
const areasFetcher = async (url: string): Promise<Area[]> => {
const response = await axiosInstance.get<AreasApiResponse>(url);
return response.data.data;
};

export const useAreas = () => {
  const { data, error, mutate } = useSWR<Area[]>('/areas', areasFetcher, {
    refreshInterval: 300000,   
    errorRetryCount: 3,
    revalidateOnFocus: true,
  });

  const sortedAreas = data ? [...data].sort((a, b) => a.id.localeCompare(b.id)) : [];

  return {
    areas: sortedAreas || [],
    isLoading: !error && !sortedAreas,
    isError: error,
    mutate,
  };
};

export const useAreaById = (areaId: string) => {
  const { data, error, mutate } = useSWR<Area>(`/areas/${areaId}`, areaFetcher, {
    refreshInterval: 300000,    
    errorRetryCount: 3,    
    revalidateOnFocus: true,
  });

  return {
    areaById: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// export const useAreaById = async (areaId: string) => {
//     try {
//       const response = await axiosInstance.get<Area>(`/areas/${areaId}`);
//       const area = response.data;
//       return area;
//     } catch (e) {
//       const error = e as AxiosError<ApiErrorResponse>;
//       throw new Error(error.response?.data?.message || 'Failed to create Area!');
//     }
//   };

export const createArea = async (
    data: { name?:string; capacity?: number }
  ) => {
    try {
      const response = await axiosInstance.post(`/areas`, data);
      return response;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(error.response?.data?.message || 'Failed to create Area!');
    }
  };

export const editArea = async (
  areaId: string, 
  data: { name?:string; capacity?: number }
) => {
  try {
    const response = await axiosInstance.patch(`/areas/${areaId}`, data);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to editing area!');
  }
};

export const deleteArea = async (
  areaId: string
) => {
  try {
    const response = await axiosInstance.delete(`/areas/${areaId}`);
    return response.data;
  } catch (e) {
    const error = e as AxiosError<ApiErrorResponse>;
    throw new Error(error.response?.data?.message || 'Failed to deleting area!');
  }
};