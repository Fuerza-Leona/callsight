import { useState } from "react";
import axios from "axios";
import { apiURL } from "@/app/constants";

const API_URL = `${apiURL}/auth/login`;

interface LoginSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    role: string;
    department: string;
  };
}

interface LoginErrorResponse {
  detail: string;
}

export const useLogin = () => {
  const [data, setData] = useState<LoginSuccessResponse | null>(null); // Store success data
  const [error, setError] = useState<string | null>(null); // Store error message
  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Send POST request using Axios
      const response = await axios.post<LoginSuccessResponse>(API_URL, {
        email,
        password,
      });

      setData(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail || "Login failed. Please try again.";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }

      // Clear any previous data
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Return the login function along with the state values
  return { login, data, loading, error };
};