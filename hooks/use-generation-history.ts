"use client";

import useSWR from "swr";
import axios from "axios";
import type { GenerationHistoryItem } from "@/types/content";

const fetcher = (url: string) =>
  axios.get<GenerationHistoryItem[]>(url).then((response) => response.data);

export function useGenerationHistory() {
  const { data, error, isLoading, mutate } = useSWR<GenerationHistoryItem[]>(
    "/api/history",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data: data ?? [],
    isLoading,
    isError: Boolean(error),
    mutate,
  };
}
