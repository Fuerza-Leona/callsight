import axios from "axios";
import { useState, useEffect } from "react";

interface Company {
  id: string;
  name: string;
}

export const fetchCompanies = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchCompaniesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://0.0.0.0:8000/api/v1/companies/");
      console.log("Response:", response.data);
      if (response.data?.companies) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  return { companies, loading, error, fetchCompaniesData };
};
