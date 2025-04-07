"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export interface topic {
  topic: string;
  amount: number;
}

export interface fetchTopicsParams {
  limit: number | null;
  clients: string[] | null;
  startDate: string | null;
  endDate: string | null;
}

export const useFetchTopics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [topics, setTopics] = useState<topic[]>([]);

  const fetchTopics = async (params?: fetchTopicsParams) => {
    setLoading(true);
    setError("");
    
    axios
      .get("/api/getToken", { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        const config = {
          headers: {
            Authorization: `Bearer ${response.data.user}`,
            withCredentials: true,
          },
          params: {
            ...(params?.limit && { limit: params.limit }),
            ...(params?.clients && params.clients.length > 0 && { clients: params.clients.join(',') }),
            ...(params?.startDate && { startDate: params.startDate }),
            ...(params?.endDate && { endDate: params.endDate }),
          }
        };
        
        axios
          .get(
            "http://127.0.0.1:8000/api/v1/topics",
            config
          )
          .then((response) => {
            setTopics(response.data.topics);
          })
          .catch((err) => {
            console.error("Error fetching topics:", err);
            setError(err);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error("Error in obtaining token: " + err);
        setLoading(false);
        setError(err);
      });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return { topics, loading, error, fetchTopics };
};