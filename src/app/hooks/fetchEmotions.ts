"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchEmotions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [positive, setPositive] = useState<number>(0);
  const [negative, setNegative] = useState<number>(0);
  const [neutral, setNeutral] = useState<number>(0);

  const fetchEmotions = () => {
    axios
      .get("/api/getToken", { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        const config = {
          headers: {
            Authorization: `Bearer ${response.data.user}`,
            withCredentials: true,
          },
        };
        console.log(config);
        axios
          .get(
            "http://127.0.0.1:8000/api/v1/conversations/myClientEmotions",
            config
          )
          .then((response) => {
            if (response.data.emotions){
              console.log(response.data);
              setPositive(response.data.emotions.positive);
              setNegative(response.data.emotions.negative);
              setNeutral(response.data.emotions.neutral);
            }
              
          })
          .catch((errorA) => {
            console.error("Error fetching emotions:", errorA);
            setError(errorA);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((errorOuter) => {
        console.error("Error in obtaining token: " + errorOuter);
      });
  };
  useEffect(() => {
    fetchEmotions();
  }, []);

  return {
    dataEmotions: { loading, error, positive, negative, neutral },
    refetchEmotions: fetchEmotions,
  };
};
