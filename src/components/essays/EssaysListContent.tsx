"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { EssayCard } from "./EssayCard";
import { EssayWithEvaluation } from "@/src/types";
import { EssayCardSkeleton } from "../ui/Skeleton";

interface EssaysResponse {
  essays: EssayWithEvaluation[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export function EssaysListContent() {
  const [data, setData] = useState<EssaysResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/essays?page=${page}&limit=10`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-7 fade-up">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">History</h1>
          <p className="text-stone-500 text-sm mt-1">
            All your submitted and evaluated essays.
          </p>
        </div>
        <Link
          href="/essays/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      <div className="space-y-3 fade-up fade-up-delay-1">
        {loading ? (
          [...Array(5)].map((_, i) => <EssayCardSkeleton key={i} />)
        ) : data?.essays.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm mb-4">
              You haven&apos;t submitted any essays yet.
            </p>
            <Link
              href="/essays/new"
              className="text-sm text-orange-700 font-medium hover:underline"
            >
              Submit your first essay →
            </Link>
          </div>
        ) : (
          data?.essays.map((essay) => (
            <EssayCard key={essay.id} essay={essay} />
          ))
        )}
      </div>

      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="flex items-center cursor-pointer gap-1 text-sm text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-xs text-stone-400">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.pagination.pages}
            className="flex items-center cursor-pointer gap-1 text-sm text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
