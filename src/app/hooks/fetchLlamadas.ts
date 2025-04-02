"use client";

import axios from "axios";
import { UUID } from "crypto";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface llamadas {
  conversation_id: UUID;
  audio_id: UUID;
  start_time: Timestamp;
  end_time: Timestamp;
  sentiment_score: number;
  confidence_score?: number;
}

export const useFetchLlamadas = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [llamadas, setLlamadas] = useState<llamadas[]>([]);

  const fetchLlamadas = async () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/conversations/")
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
  };

  useEffect(() => {
    fetchLlamadas();
  }, []);

  return {
    dataLlamadas: { loading, error, llamadas },
    refetchLlamadas: fetchLlamadas,
  };
};
