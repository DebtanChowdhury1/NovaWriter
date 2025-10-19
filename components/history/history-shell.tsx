"use client";

import axios from "axios";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGenerationHistory } from "@/hooks/use-generation-history";
import { HistoryTable } from "./history-table";

export function HistoryShell() {
  const { data, isLoading, isError, mutate } = useGenerationHistory();

  useEffect(() => {
    const handler = () => {
      void mutate();
    };

    window.addEventListener("generation:created", handler);
    return () => {
      window.removeEventListener("generation:created", handler);
    };
  }, [mutate]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/history?id=${id}`);
      toast.success("Entry removed");
      await mutate();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete entry right now.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300 bg-base-100 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-base-content/70">
          Loading your history...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>
          We could not load your history right now. Please refresh or try again
          later.
        </span>
      </div>
    );
  }

  return <HistoryTable items={data} onDelete={handleDelete} />;
}
