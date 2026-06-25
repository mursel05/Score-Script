"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, Hash, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { EssayWithEvaluation, getBandColor, getBandLabel } from "@/src/types";
import { Skeleton } from "../ui/Skeleton";
import { BandScore } from "../ui/BandScore";
import { fetcher } from "@/src/lib/api";

export function EssayDetailContent({ essayId }: { essayId: string }) {
  const [essay, setEssay] = useState<EssayWithEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetcher(`/essays/${essayId}`)
      .then((d) => {
        if (d.error) setError("Esse yüklənmədi");
        else setEssay(d.essay);
      })
      .catch(() => setError("Esse yüklənmədi"))
      .finally(() => setLoading(false));
  }, [essayId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error || !essay) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800 mb-1">Xəta</p>
            <p className="text-sm text-red-600">{error || "Esse tapılmadı."}</p>
          </div>
        </div>
      </div>
    );
  }

  const band = essay.evaluation?.overallBand;
  const color = band != null ? getBandColor(band) : "#a8a29e";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/essays"
        className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Tarix
      </Link>

      <div className="mb-6 fade-up">
        <h1 className="font-serif text-2xl text-stone-900 mb-3">{essay.title}</h1>
        <div className="flex items-center gap-4 text-xs text-stone-400">
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {essay.wordCount} söz
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(essay.createdAt), "MMMM d, yyyy · h:mm a")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 fade-up fade-up-delay-1">
        <div className="bg-white border border-stone-200 rounded-xl p-6 flex items-center gap-6">
          {band != null ? (
            <BandScore score={band} size="lg" />
          ) : (
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-300">—</div>
              <p className="text-xs text-stone-400 mt-1">Qiymətləndirilmədi</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">
              Ümumi Bal
            </p>
            {band != null ? (
              <>
                <p className="text-2xl font-bold" style={{ color }}>
                  {band.toFixed(1)}
                </p>
                <p className="text-sm font-medium" style={{ color }}>
                  {getBandLabel(band)}
                </p>
                <p className="text-xs text-stone-400 mt-1">5.0-dən</p>
              </>
            ) : (
              <p className="text-sm text-stone-400">Qiymətləndirmə gözlənilir</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-4">
            Qiymətləndirmə Vəziyyəti
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-stone-700">Esse göndərildi</span>
            </div>
            <div className="flex items-center gap-2">
              {band != null ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
              )}
              <span className="text-sm text-stone-700">AI Qiymətləndirməsi</span>
            </div>
            {band != null && essay.evaluation && (
              <p className="text-xs text-stone-400 pl-6">
                Tamamlanmış {format(new Date(essay.evaluation.createdAt), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 fade-up fade-up-delay-2">
        <h2 className="text-sm font-semibold text-stone-800 mb-4">Esse Məzmunu</h2>
        <div className="prose prose-sm prose-stone max-w-none">
          {essay.content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-stone-700 leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <Link
          href="/essays/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          Yeni Esse Göndərin
        </Link>
        <Link
          href="/essays"
          className="flex items-center gap-2 bg-white text-stone-700 border border-stone-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:border-stone-400 transition-colors"
        >
          Keçmiş Esselər
        </Link>
      </div>
    </div>
  );
}
