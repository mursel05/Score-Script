import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalEssays, evaluations, recentEssays] = await prisma.$transaction([
      prisma.essay.count({ where: { userId } }),
      prisma.evaluation.findMany({
        where: { essay: { userId } },
        orderBy: { createdAt: "asc" },
        select: { overallBand: true, createdAt: true },
      }),
      prisma.essay.findMany({
        where: { userId },
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const averageBand =
      evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + e.overallBand, 0) /
          evaluations.length
        : null;

    const bandTrend = evaluations.slice(-30).map((e) => ({
      date: e.createdAt.toISOString().split("T")[0],
      band: e.overallBand,
    }));

    return NextResponse.json({
      totalEssays,
      averageBand: averageBand ? Math.round(averageBand * 10) / 10 : null,
      recentEssays: recentEssays.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
        evaluation: e.evaluation
          ? {
              ...e.evaluation,
              createdAt: e.evaluation.createdAt.toISOString(),
            }
          : null,
      })),
      bandTrend,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
