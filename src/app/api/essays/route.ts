import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateEssay } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createEssaySchema,
  countWords,
  validateWordCount,
} from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(`essays:${session.user.id}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before submitting another essay.",
          resetAt: rateLimit.resetAt,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetAt),
          },
        }
      );
    }

    const body = await req.json();

    // Validate input
    const parsed = createEssaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, content } = parsed.data;
    const wordCount = countWords(content);

    if (!validateWordCount(content)) {
      return NextResponse.json(
        { error: `Essay exceeds 500 word limit. Current count: ${wordCount}` },
        { status: 400 }
      );
    }

    // Save essay to database
    const essay = await prisma.essay.create({
      data: {
        userId: session.user.id,
        title,
        content,
        wordCount,
      },
    });

    // Evaluate with Gemini
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
      // Essay was saved — return it without evaluation
      return NextResponse.json(
        {
          essay: { ...essay, evaluation: null, createdAt: essay.createdAt.toISOString() },
          warning: "Essay saved but evaluation failed. Please try again.",
        },
        { status: 207 }
      );
    }

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    const [essays, total] = await prisma.$transaction([
      prisma.essay.findMany({
        where: { userId: session.user.id },
        include: { evaluation: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.essay.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      essays: essays.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
        evaluation: e.evaluation
          ? {
              ...e.evaluation,
              createdAt: e.evaluation.createdAt.toISOString(),
            }
          : null,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/essays error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
