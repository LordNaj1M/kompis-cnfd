// src/hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import { cache } from "swr/_internal";

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

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { token, data: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      return response.data;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const register = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const resetPassword = async (data: {
    email: string;
    newPassword: string;
    security_answer: string;
  }) => {
    try {
      const response = await axiosInstance.patch("/resetPassword", data);
      return response;
    } catch (e) {
      const error = e as AxiosError<ApiErrorResponse>;
      throw new Error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    }
  };

  const logout = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await new Promise((res) => setTimeout(res, 1000));

        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        cache.delete("/users/profile");

        resolve(true);
      } catch (error) {
        reject(new Error("Logout failed. Please try again. " + error));
      } finally {
        navigate("/login");
      }
    });
  };

  return {
    login,
    register,
    resetPassword,
    logout,
  };
};
