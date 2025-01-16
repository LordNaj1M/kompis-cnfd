// src/hooks/useCrowd.ts
import useSWR from "swr";
import { axiosInstance } from "../lib/axios";
import { useAreas } from "./useArea";

interface Crowd {
  id: string;
  status: string;
  count: number;
  createdAt: string;
  area_id: string;
}

interface CrowdsApiResponse {
  data: Crowd[];
  message?: string;
}

interface CrowdApiResponse {
  data: Crowd;
  message?: string;
}

// Fungsi fetcher untuk data semua crowds
const crowdsFetcher = async (url: string): Promise<Crowd[]> => {
  const response = await axiosInstance.get<CrowdsApiResponse>(url);
  return response.data.data;
};

// Fungsi fetcher untuk data crowd tunggal
const crowdFetcher = async (url: string): Promise<Crowd> => {
  const response = await axiosInstance.get<CrowdApiResponse>(url);
  return response.data.data;
};

export const useCrowds = () => {
  const { data, error, mutate } = useSWR<Crowd[]>("/crowds", crowdsFetcher, {
    // refreshInterval: 300000,
    errorRetryCount: 3,
    revalidateOnFocus: true,
  });
  const areas = useAreas();
  const areaMap = new Map<string, string>();
  areas.areas?.forEach((area) => {
    areaMap.set(area.id, area.name);
  });

  const sortedData = data
    ? [...data]
        // .sort((a, b) => a.id.localeCompare(b.id))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          }),
        }))
    : [];

  const getLastCrowdPerArea = new Map<string, Crowd & { areaName: string }>();
  [...sortedData].forEach((crowd) => {
    if (!getLastCrowdPerArea.has(crowd.area_id)) {
      getLastCrowdPerArea.set(crowd.area_id, {
        ...crowd,
        areaName: areaMap.get(crowd.area_id) || "Unknown Area",
      });
    }
  });

  const lastCrowdPerArea = Array.from(getLastCrowdPerArea.values());

  return {
    crowds: sortedData || [],
    lastCrowdPerArea,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useCrowdSortById = (areaId: string) => {
  const { crowds, isError, mutate } = useCrowds();

  const crowdSortById = crowds
    ? crowds
        .filter((crowd) => crowd.area_id === areaId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : [];

  return {
    crowdSortById,
    isLoading: !isError && !crowds,
    isError: isError,
    mutate,
  };
};

export const useCrowdById = (areaId: string) => {
  const { data, error, mutate } = useSWR<Crowd>(
    `/crowds/${areaId}`,
    crowdFetcher,
    {
      // refreshInterval: 300000,
      errorRetryCount: 3,
      revalidateOnFocus: true,
    }
  );

  return {
    crowdById: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
