"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FileText, TrendingUp, Award, Plus } from "lucide-react";
import { StatCard } from "./StatCard";
import { BandTrendChart } from "./BandTrendChart";
import { DashboardStats } from "@/src/types";
import { EssayCardSkeleton, StatCardSkeleton } from "../ui/Skeleton";
import { fetcher } from "@/src/lib/api";

export function DashboardContent() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher("/dashboard")
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "İstifadəçi";

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-8 fade-up">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Salam, {firstName}</h1>
          <p className="text-stone-500 text-sm mt-1">Yazınızın irəliləməsi icmalı</p>
        </div>
        <Link
          href="/essays/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Esse
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 fade-up fade-up-delay-1">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Esse sayı"
              value={stats?.totalEssays ?? 0}
              icon={FileText}
              subtext="Göndərilən"
              color="#c2410c"
            />
            <StatCard
              label="Orta Bal"
              value={stats?.averageBand != null ? stats.averageBand.toFixed(1) : "—"}
              icon={Award}
              subtext="Bütün esselər üzrə"
              color="#16a34a"
            />
            <StatCard
              label="Son Bal"
              value={stats?.recentBand != null ? stats.recentBand.toFixed(1) : "—"}
              icon={TrendingUp}
              subtext="Ən son esse"
              color="#2563eb"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 fade-up fade-up-delay-2">
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-800 mb-4">İnkişaf</h2>
          {loading ? (
            <div className="skeleton h-48 rounded-lg" />
          ) : (
            <BandTrendChart data={stats?.bandTrend ?? []} />
          )}
        </div>

        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-800">Son Esselər</h2>
            <Link
              href="/essays"
              className="text-xs text-orange-700 hover:text-orange-800 font-medium"
            >
              Hamısı
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <EssayCardSkeleton key={i} />
              ))}
            </div>
          ) : stats?.recentEssays?.length ? (
            <div className="space-y-2">
              {stats.recentEssays.map((essay) => (
                <Link
                  key={essay.id}
                  href={`/essays/${essay.id}`}
                  className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0 hover:text-orange-800 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate group-hover:text-orange-700 transition-colors">
                      {essay.title}
                    </p>
                    <p className="text-xs text-stone-400">{essay.wordCount} söz</p>
                  </div>
                  {essay.evaluation && (
                    <span className="text-sm font-bold ml-3 text-orange-700 shrink-0">
                      {essay.evaluation.overallBand.toFixed(1)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-stone-400 mb-3">Hələki heç bir esse yoxdur.</p>
              <Link
                href="/essays/new"
                className="text-xs text-orange-700 font-medium hover:underline"
              >
                Birinci essenizi göndərin →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
