"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import api from "@/lib/axios";

interface DeleteResponse {
  message: string;
  status: number;
}

interface UseDeleteReturn {
  deleteData: DeleteResponse | null;
  loading: boolean;
  error: any;
  deleteRequest: (documentIds: string[]) => Promise<void>;
}

const useDelete = (url: string): UseDeleteReturn => {
  const { data: session } = useSession();
  const [deleteData, setDeleteData] = useState<DeleteResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const deleteRequest = async (documentIds: string[]) => {
    if (!documentIds || documentIds.length === 0) {
      setError(new Error("No document IDs provided"));
      return;
    }

    setLoading(true);
    setError(null);
    setDeleteData(null);

    try {
        // @ts-ignore
        const headers = session?.token
        // @ts-ignore
        ? { Authorization: `Bearer ${session.token}` }
        : {};

      // Send DELETE requests for each documentId
      const responses = await Promise.all(
        documentIds.map((documentId) =>
          api.delete(`${url}/${documentId}`, { headers })
        )
      );

      // Assume the last response or a combined message for simplicity
      const lastResponse = responses[responses.length - 1];
      setDeleteData(lastResponse?.data || { message: "Products deleted successfully", status: 200 });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 401) {
        alert("انتهت جلستك ربما تم فتح جلستك في مكان اخر");
        signOut({ callbackUrl: "/login" });
      }
      setError(err);
    }
  };

  return { deleteData, loading, error, deleteRequest };
};

export default useDelete;