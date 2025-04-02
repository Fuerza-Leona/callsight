"use client";

import axios from "axios";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import { apiURL } from '../constants';

export interface categorias {
  category_id: UUID;
  name: string;
}

export const useFetchCategorias = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | unknown>("");
  const [categorias, setcategorias] = useState<string[]>([]);

  const fetchCategorias = async () => {
    axios
      .get(`${apiURL}/categories`)
      .then((response) => {
        console.log(response)
        setcategorias(response.data.categories);
      })
      .catch((errorA) => {
        console.error("Error fetching categories:", errorA);
        setError(errorA);
        setcategorias([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    datacategorias: { loading, error, categorias },
    refetchcategorias: fetchCategorias,
  };
};
