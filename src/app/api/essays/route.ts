import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { checkRateLimit } from "@/src/lib/rate-limit";
import { countWords, createEssaySchema } from "@/src/lib/validations";
import { prisma } from "@/src/lib/prisma";
import { evaluateEssay } from "@/src/lib/gemini";
import z from "zod";

const DAILY_EVALUATE_COUNT = parseInt(process.env.DAILY_EVALUATE_COUNT || "10", 10);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (
      session?.user?.evaluateCount >= DAILY_EVALUATE_COUNT &&
      session?.user?.resetLimitAt &&
      new Date(session.user.resetLimitAt) > new Date()
    ) {
      return NextResponse.json(
        {
          error: `Günlük qiymətləndirmə limitinizə çatdınız. Limit ${new Date(session.user.resetLimitAt).toLocaleTimeString()} UTC-də sıfırlanacaq.`,
          success: false,
        },
        { status: 429 }
      );
    }

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

    const essay = await prisma.essay.create({
      data: {
        userId: session?.user?.id || "",
        title,
        content,
        wordCount,
      },
    });

    let evaluation = null;
    try {
      const result = await evaluateEssay(content);
      evaluation = await prisma.evaluation.create({
        data: {
          essayId: essay.id,
          overallBand: result.overallBand,
        },
      });
    } catch (aiError) {
      console.error("AI evaluation failed:", aiError);
      return NextResponse.json(
        {
          error: "Esse saxlanıldı amma qiymətləndirmə uğursuz oldu. Yenidən cəhd edin.",
          success: false,
        },
        { status: 207 }
      );
    }

    await prisma.user.update({
      where: { id: session?.user?.id },
      data: {
        evaluateCount:
          session?.user?.evaluateCount >= DAILY_EVALUATE_COUNT
            ? 0
            : session?.user?.evaluateCount + 1,
        resetLimitAt: new Date(),
      },
    });

    return NextResponse.json({
      essay: {
        ...essay,
        createdAt: essay.createdAt.toISOString(),
        evaluation: evaluation
          ? { ...evaluation, createdAt: evaluation.createdAt.toISOString() }
          : null,
      },
    });
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
