import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const [totalEssays, evaluations, recentBand, recentEssays] =
      await prisma.$transaction([
        prisma.essay.count({ where: { userId } }),
        prisma.evaluation.findMany({
          where: { essay: { userId } },
          orderBy: { createdAt: "asc" },
          select: { overallBand: true, createdAt: true },
        }),
        prisma.essay.findFirst({
          where: {
            userId,
            evaluation: {
              isNot: null,
            },
          },
          select: {
            evaluation: {
              select: {
                overallBand: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
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
        ? evaluations.reduce(
            (sum: number, e: { overallBand: number }) => sum + e.overallBand,
            0
          ) / evaluations.length
        : null;

    const bandTrend = evaluations
      .slice(-30)
      .map((e: { createdAt: Date; overallBand: number }) => ({
        date: e.createdAt.toISOString().split("T")[0],
        band: e.overallBand,
      }));

    return NextResponse.json({
      success: true,
      totalEssays,
      averageBand,
      recentBand: recentBand?.evaluation?.overallBand ?? null,
      recentEssays,
      bandTrend,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Server xətası", success: false }, { status: 500 });
  }
}
