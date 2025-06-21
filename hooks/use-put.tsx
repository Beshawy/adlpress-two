// src/hooks/use-put.ts
"use client";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import api from "@/lib/axios";

interface UsePutResponse {
  data: any;
  loading: boolean;
  error: any;
  put: (body: any, config?: any) => Promise<any>;
}

const usePut = (url: string): UsePutResponse => {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const put = async (body: any, config?: any) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api.put(url, body, {
        ...config,
        headers: {
          ...config?.headers,
          // @ts-ignore
           Authorization: `Bearer ${session?.token}` 
        },
      });
      setData(response.data);
      return response;
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("انتهت جلستك ربما تم فتح جلستك في مكان اخر");
        signOut({ callbackUrl: "/login" });
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, put };
};

export default usePut;