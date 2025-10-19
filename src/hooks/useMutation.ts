"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { ApiError } from "@/lib/types";
function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) return false;
  const potentialApiError = error as ApiError;
  return "errors" in potentialApiError && Array.isArray(potentialApiError.errors);
}

export function useMutation<T, U>(
  mutationFn: (data: T) => Promise<U>,
  options?: {
    onSuccess?: (result: U) => void;
    onError?: (error: string) => void;
  }
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(data);
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";
      if (isApiError(err)) {
        errorMessage = err.errors[0]?.message || errorMessage;
      }
      setError(errorMessage);
      if (options?.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
