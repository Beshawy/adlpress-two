import api from "@/lib/axios";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useFetchAuth = (url: string, refresh?: boolean, responseType?: any) => {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    // @ts-ignore    
    if (session != null) {
      api
        .get(url, {
          headers: {
            // @ts-ignore
            ...(session?.token ? { Authorization: `Bearer ${session?.token}` } : {}),
          },
          responseType: responseType,
        })
        .then((res) => {
          setData(res?.data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            alert("انتهت جلستك ربما تم فتح جلستك في مكان اخر");
            signOut({
              callbackUrl: '/login',
            })
          }
          setLoading(false);
          setError(err);
        });
    } else if(session === null) { 
      api
        .get(url, {
          responseType: responseType,
        })
        .then((res) => {
          setData(res?.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [refresh, session]);
  return { data, loading, error };
};

export default useFetchAuth;
