"use client";

import axios from "axios";
import { UUID } from "crypto";
import { useEffect, useState } from "react";

interface Timestamp {
  toString(): string;
  seconds: number;
  nanoseconds: number;
}

export interface llamadas {
  conversation_id: UUID;
  audio_id: UUID;
  start_time: Timestamp;
  end_time: Timestamp;
  sentiment_score: number;
  confidence_score?: number;
  categories: string[];
}

export const useFetchLlamadas = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [llamadas, setLlamadas] = useState<llamadas[]>([]);

  const fetchLlamadas = async () => {

    axios
      .get("/api/getToken", { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        const config = {
          headers: { Authorization: `Bearer ${response.data.user}`, withCredentials: true },
        };

        console.log(config)
        axios
          .get("http://127.0.0.1:8000/api/v1/conversations/mine", config)
          .then((response) => {
            setLlamadas(response.data.conversations);
          })
          .catch((errorA) => {
            console.error("Error fetching conversations:", errorA);
            setError(errorA);
            setLlamadas([]);
          })
          .finally(() => {
            setLoading(false);
          });
      });
  };

  useEffect(() => {
    fetchLlamadas();
  }, []);

  return {
    dataLlamadas: { loading, error, llamadas },
    refetchLlamadas: fetchLlamadas,
  };
};
