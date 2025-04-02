import axios from "axios";
import { useState, useEffect } from "react";

interface Participant {
  id: string;
  name: string;
}

export const fetchParticipants = (companyId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipantsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/companies/${companyId}/list`);
      if (response.data?.companies) {
        setParticipants(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchParticipantsData();
    }
  }, [companyId]);

  return { participants, loading, error };
};
