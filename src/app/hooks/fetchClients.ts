"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchClients = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | unknown>("");
    //const [clients, setClients] = useState<employees[]>([]);
    const [namesClients, setNamesClients] = useState<string[]>([]);

    const fetchData = async () => {
        axios
            .get("http://127.0.0.1:8000/api/v1/users/client")
            .then((response) => {
                //setClients(response.data.data);
                setNamesClients(response.data.users);
            })
            .catch((errorA) => {
                console.error("Error fetching summary:", errorA);
                setError(errorA);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data: { loading, error, namesClients }, refetchClients: fetchData };
};
