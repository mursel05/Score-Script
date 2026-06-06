"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FileText, TrendingUp, Award, Plus } from "lucide-react";
import { StatCard } from "./StatCard";
import { BandTrendChart } from "./BandTrendChart";
import { EssayCard } from "@/components/essays/EssayCard";
import { StatCardSkeleton, EssayCardSkeleton } from "@/components/ui/Skeleton";
import type { DashboardStats } from "@/types";

export function DashboardContent() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 fade-up">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">
            Hello, {firstName}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Here&apos;s an overview of your writing progress.
          </p>
        </div>
        <Link
          href="/essays/new"
          className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Essay
        </Link>
      </div>

      {/* Stats row */}
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
              label="Total Essays"
              value={stats?.totalEssays ?? 0}
              icon={FileText}
              subtext="Checked so far"
              color="#c2410c"
            />
            <StatCard
              label="Average Band"
              value={
                stats?.averageBand != null
                  ? stats.averageBand.toFixed(1)
                  : "—"
              }
              icon={Award}
              subtext="Across all essays"
              color="#16a34a"
            />
            <StatCard
              label="Latest Band"
              value={
                stats?.recentEssays?.[0]?.evaluation?.overallBand != null
                  ? stats.recentEssays[0].evaluation!.overallBand.toFixed(1)
                  : "—"
              }
              icon={TrendingUp}
              subtext="Most recent essay"
              color="#2563eb"
            />
          </>
        )}
      </div>

      {/* Chart + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 fade-up fade-up-delay-2">
        {/* Trend chart */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-800 mb-4">
            Band Score Trend
          </h2>
          {loading ? (
            <div className="skeleton h-48 rounded-lg" />
          ) : (
            <BandTrendChart data={stats?.bandTrend ?? []} />
          )}
        </div>

        {/* Recent essays */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-800">Recent</h2>
            <Link
              href="/essays"
              className="text-xs text-orange-700 hover:text-orange-800 font-medium"
            >
              View all
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
                    <p className="text-xs text-stone-400">
                      {essay.wordCount} words
                    </p>
                  </div>
                  {essay.evaluation && (
                    <span className="text-sm font-bold ml-3 text-orange-700 flex-shrink-0">
                      {essay.evaluation.overallBand.toFixed(1)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-stone-400 mb-3">No essays yet</p>
              <Link
                href="/essays/new"
                className="text-xs text-orange-700 font-medium hover:underline"
              >
                Submit your first essay →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
