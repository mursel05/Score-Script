"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { EssayCard } from "./EssayCard";
import { EssayWithEvaluation } from "@/src/types";
import { EssayCardSkeleton } from "../ui/Skeleton";
import { fetcher } from "@/src/lib/api";

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
    fetcher(`/essays?page=${page}&limit=10`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-7 fade-up">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Tarix</h1>
          <p className="text-stone-500 text-sm mt-1">Bütün esseləriniz.</p>
        </div>
        <Link
          href="/essays/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni
        </Link>
      </div>

      <div className="flex flex-col gap-4 fade-up fade-up-delay-1">
        {loading ? (
          [...Array(5)].map((_, i) => <EssayCardSkeleton key={i} />)
        ) : data?.essays.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm mb-4">Hələki heç bir esse yoxdur.</p>
            <Link
              href="/essays/new"
              className="text-sm text-orange-700 font-medium hover:underline"
            >
              Birinci essenizi göndərin →
            </Link>
          </div>
        ) : (
          data?.essays.map((essay) => <EssayCard key={essay.id} essay={essay} />)
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
            Əvvəlki
          </button>
          <span className="text-xs text-stone-400">
            Səhifə {data.pagination.page} / {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.pagination.pages}
            className="flex items-center cursor-pointer gap-1 text-sm text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Sonrakı
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
