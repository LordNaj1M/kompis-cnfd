// src/hooks/useFatigue.ts
import useSWR from "swr";
import { axiosInstance } from "../lib/axios";
import { useUsers } from "./useUser";
import { useState, useEffect, useMemo } from "react";

interface Fatigue {
  id: string;
  status: string;
  createdAt: string;
  user_id: string;
}

interface FatiguesApiResponse {
  data: Fatigue[];
  message?: string;
}

// Fungsi fetcher untuk data semua fatigues
const fatiguesFetcher = async (url: string): Promise<Fatigue[]> => {
  const response = await axiosInstance.get<FatiguesApiResponse>(url);
  return response.data.data;
};

export const useFatigues = () => {
  const { data, error, mutate } = useSWR<Fatigue[]>(
    "/fatigues",
    fatiguesFetcher,
    {
      // refreshInterval: 300000,
      errorRetryCount: 3,
      revalidateOnFocus: true,
    }
  );
  const users = useUsers();
  const userMap = new Map<string, string>();
  users.users?.forEach((user) => {
    userMap.set(user.id, user.email);
  });

  const sortedData = data
    ? [...data]
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

  const getLastFatiguePerUser = new Map<
    string,
    Fatigue & { userEmail: string }
  >();
  [...sortedData].forEach((fatigue) => {
    if (!getLastFatiguePerUser.has(fatigue.user_id)) {
      getLastFatiguePerUser.set(fatigue.user_id, {
        ...fatigue,
        userEmail: userMap.get(fatigue.user_id) || "Unknown User",
      });
    }
  });

  const lastFatiguePerUser = Array.from(getLastFatiguePerUser.values());

  return {
    fatigues: sortedData || [],
    lastFatiguePerUser,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useFatigueSortByUserId = (userId: string) => {
  const { data, error, mutate } = useSWR<Fatigue[]>(
    `/fatigues/users/${userId}`,
    fatiguesFetcher,
    {
      errorRetryCount: 3,
      revalidateOnFocus: true,
    }
  );

  const [normalStatusByUser, setNormalStatusByUser] = useState({
    StatusByUser: "",
    createdAt: "",
  });
  const [menguapStatusByUser, setMenguapStatusByUser] = useState({
    StatusByUser: "",
    createdAt: "",
  });
  const [microsleepStatusByUser, setMicrosleepStatusByUser] = useState({
    StatusByUser: "",
    createdAt: "",
  });
  const [sangatLelahStatusByUser, setSangatLelahStatusByUser] = useState({
    StatusByUser: "",
    createdAt: "",
  });

  const sortedData = useMemo(() => {
    return data
      ? [...data]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            }),
          }))
      : [];
  }, [data]);

  // Update StatusByUser berdasarkan data yang diterima
  useEffect(() => {
    sortedData.forEach((fatigueData) => {
      switch (fatigueData.status) {
        case "Normal":
          setNormalStatusByUser((prev) => ({ ...prev, ...fatigueData }));
          break;
        case "Open Mouth":
          setMenguapStatusByUser((prev) => ({ ...prev, ...fatigueData }));
          break;
        case "Close Eye":
          setMicrosleepStatusByUser((prev) => ({ ...prev, ...fatigueData }));
          break;
        case "Open Mouth and Close Eye":
          setSangatLelahStatusByUser((prev) => ({ ...prev, ...fatigueData }));
          break;
      }
    });
  }, [sortedData]);

  return {
    fatigueSortById: sortedData || [],
    normalStatusByUser,
    menguapStatusByUser,
    microsleepStatusByUser,
    sangatLelahStatusByUser,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
