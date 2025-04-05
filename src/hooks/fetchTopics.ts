"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export interface topic {
  topic: string;
  amount: number;
}

export const useFetchTopics = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [topics, setTopics] = useState<topic[]>([]);

  const fetchTopics = async () => {
    axios
      .get("/api/getToken", { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        const config = {
          headers: {
            Authorization: `Bearer ${response.data.user}`,
            withCredentials: true,
          },
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
      });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return  { topics, loading, error, fetchTopics }
};
