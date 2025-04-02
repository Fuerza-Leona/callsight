"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchEmotions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const emotions = "hi";
  const fetchEmotions = async () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/conversations/myClientEmotions")
      .then((response) => {
        console.log(response.data);
      })
      .catch((errorA) => {
        console.error("Error fetching emotions:", errorA);
        setError(errorA);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmotions();
  }, []);

  return { data: { loading, error, emotions }, refetchEmotions: fetchEmotions };
};
