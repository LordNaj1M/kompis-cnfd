// src/hooks/useCrowd.ts
import useSWR from "swr";
import { axiosInstance } from "../lib/axios";
import { useAreas, useAreasByUserId } from "./useArea";
import { useUsers } from "./useUser";

interface Crowd {
  id: string;
  status: string;
  count: number;
  createdAt: string;
  area_id: string;
  user_id: string;
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
    fallbackData: [
      {
        id: "",
        status: "",
        count: 0,
        createdAt: new Date().toISOString(),
        area_id: "",
        user_id: "",
      },
    ],
  });
  const { users } = useUsers();
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
      const areaName = areaMap.get(crowd.area_id) || "Unknown Area";
      const userEmail =
        users.find((user) => user.id === crowd.user_id)?.email ||
        "Unknown User";

      getLastCrowdPerArea.set(crowd.area_id, {
        ...crowd,
        areaName: `${areaName}<>${userEmail}`,
      });
    }
  });

  const lastCrowdPerArea = Array.from(getLastCrowdPerArea.values());
  lastCrowdPerArea.sort((a, b) => {
    const nameA = a.areaName.toLowerCase();
    const nameB = b.areaName.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

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
      fallbackData: {
        id: "",
        status: "",
        count: 0,
        createdAt: new Date().toISOString(),
        area_id: areaId,
        user_id: "",
      },
    }
  );

  return {
    crowdById: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useCrowdsByUser = (userId: string) => {
  const { data, error, mutate } = useSWR<Crowd[]>(
    `/crowds/users/${userId}`,
    crowdsFetcher,
    {
      // refreshInterval: 300000,
      errorRetryCount: 3,
      revalidateOnFocus: true,
      fallbackData: [
        {
          id: "",
          status: "",
          count: 0,
          createdAt: new Date().toISOString(),
          area_id: "",
          user_id: userId,
        },
      ],
    }
  );

  const areasByUserId = useAreasByUserId(userId);
  const areaMap = new Map<string, string>();
  areasByUserId.areasByUserId?.forEach((area) => {
    areaMap.set(area.id, area.name);
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

  const getLastCrowdPerAreaUser = new Map<
    string,
    Crowd & { areaName: string }
  >();
  [...sortedData].forEach((crowd) => {
    if (!getLastCrowdPerAreaUser.has(crowd.area_id)) {
      getLastCrowdPerAreaUser.set(crowd.area_id, {
        ...crowd,
        areaName: areaMap.get(crowd.area_id) || "Unknown Area",
      });
    }
  });

  const lastCrowdPerAreaUser = Array.from(getLastCrowdPerAreaUser.values());
  lastCrowdPerAreaUser.sort((a, b) => {
    const nameA = a.areaName.toLowerCase();
    const nameB = b.areaName.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return {
    crowdsUser: sortedData || [],
    lastCrowdPerAreaUser,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// export const useCrowdSortByIdByUser = (areaId: string) => {
//   const { crowdsUser, isError, mutate } = useCrowdsByUser();

//   const crowdSortById = crowdsUser
//     ? crowdsUser
//         .filter((crowd) => crowd.area_id === areaId)
//         .sort(
//           (a, b) =>
//             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         )
//     : [];

//   return {
//     crowdSortById,
//     isLoading: !isError && !crowdsUser,
//     isError: isError,
//     mutate,
//   };
// };
