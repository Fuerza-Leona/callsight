"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export interface client {
    user_id: string;
    username: string;
}

export const useFetchClients = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | unknown>("");
    const [clients, setClients] = useState<client[]>([]);

    const refetchClients = async () => {
        axios
            .get("http://127.0.0.1:8000/api/v1/users/client")
            .then((response) => {
                console.log("Response from API:", response.data);
                setClients(response.data);
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
        refetchClients();
    }, []);

    return { clients, loadingClients: loading, errorClients: error, refetchClients };
};
