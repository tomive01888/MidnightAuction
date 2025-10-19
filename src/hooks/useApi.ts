"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/lib/types";

function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const potentialApiError = error as ApiError;
  return (
    "errors" in potentialApiError &&
    Array.isArray(potentialApiError.errors) &&
    "status" in potentialApiError &&
    "statusCode" in potentialApiError
  );
}

/**
 * A robust, reusable hook for handling API calls, loading, and error states.
 * @param apiCall A function that returns a promise resolving to { data: T }.
 *                IMPORTANT: The component calling this hook should wrap this function in `useCallback`
 *                to prevent infinite loops.
 * @returns An object with the fetched data, loading state, error state, and a manual refetch function.
 */
export function useApi<T>(apiCall: () => Promise<{ data: T }>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiCall();
      setData(response.data);
      setError(null);
    } catch (err) {
      if (isApiError(err)) {
        const errorMessage = err.errors[0]?.message || "An API error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = "An unexpected network or system error occurred.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Non-API Error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
