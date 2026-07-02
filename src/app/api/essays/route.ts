import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { countWords, createEssaySchema } from "@/src/lib/validations";
import { prisma } from "@/src/lib/prisma";
import { evaluateEssay } from "@/src/lib/gemini";
import z from "zod";

const DAILY_EVALUATE_COUNT = parseInt(process.env.DAILY_EVALUATE_COUNT || "10", 10);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return;
    }
    const userId = session?.user.id;
    const body = await req.json();
    const parsed = createEssaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error), success: false },
        { status: 400 }
      );
    }
    const { title, content } = parsed.data;
    const wordCount = countWords(content);

    const now = new Date();
    const tomorrowUTC = new Date(now);
    tomorrowUTC.setUTCHours(24, 0, 0, 0);

    let claim = await prisma.user.updateMany({
      where: {
        id: userId,
        resetLimitAt: { gt: now },
        evaluateCount: { lt: DAILY_EVALUATE_COUNT },
      },
      data: { evaluateCount: { increment: 1 } },
    });

    if (claim.count === 0) {
      claim = await prisma.user.updateMany({
        where: {
          id: userId,
          OR: [{ resetLimitAt: null }, { resetLimitAt: { lte: now } }],
        },
        data: { evaluateCount: 1, resetLimitAt: tomorrowUTC },
      });

      if (claim.count === 0) {
        const current = await prisma.user.findUnique({
          where: { id: userId },
          select: { resetLimitAt: true },
        });
        return NextResponse.json(
          {
            error: `Günlük qiymətləndirmə limitinizə çatdınız. Limit ${current?.resetLimitAt?.toLocaleTimeString()} UTC-də sıfırlanacaq.`,
            success: false,
          },
          { status: 429 }
        );
      }
    }

    const essay = await prisma.essay.create({
      data: { userId, title, content, wordCount },
    });

    try {
      const result = await evaluateEssay(content);
      if (result.error) {
        await prisma.evaluation.create({
          data: {
            essayId: essay.id,
            criteriaA: 0,
            criteriaB: 0,
            criteriaC: 0,
            criteriaD: 0,
            overallBand: 0,
            aiOutput: result.aiOutput,
          },
        });
        throw new Error(result.error);
      }
      if (
        result.criteriaA !== undefined &&
        result.criteriaB !== undefined &&
        result.criteriaC !== undefined &&
        result.criteriaD !== undefined &&
        result.overallBand !== undefined
      ) {
        await prisma.evaluation.create({
          data: {
            essayId: essay.id,
            criteriaA: result.criteriaA,
            criteriaB: result.criteriaB,
            criteriaC: result.criteriaC,
            criteriaD: result.criteriaD,
            overallBand: result.overallBand,
            aiOutput: result.aiOutput,
          },
        });
      }
    } catch (aiError) {
      console.error("AI evaluation failed:", aiError);
      await prisma.user
        .update({
          where: { id: userId },
          data: { evaluateCount: { decrement: 1 } },
        })
        .catch((e) => console.error("Failed to refund evaluateCount:", e));
      return NextResponse.json(
        {
          error: "Esse saxlanıldı amma qiymətləndirmə uğursuz oldu. Yenidən cəhd edin.",
          success: false,
        },
        { status: 207 }
      );
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        averageBand: {
          set: await prisma.evaluation
            .aggregate({
              where: { essay: { userId } },
              _avg: { overallBand: true },
            })
            .then((agg) => agg._avg.overallBand || 0),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/essays error:", error);
    return NextResponse.json({ error: "Server xətası", success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    const [essays, total] = await prisma.$transaction([
      prisma.essay.findMany({
        where: { userId: session?.user?.id },
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.essay.count({ where: { userId: session?.user?.id } }),
    ]);

    return NextResponse.json({
      success: true,
      essays,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/essays error:", error);
    return NextResponse.json({ error: "Server xətası", success: false }, { status: 500 });
  }
}
