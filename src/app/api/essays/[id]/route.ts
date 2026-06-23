import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid essay ID" }, { status: 400 });
    }

    const essay = await prisma.essay.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: { evaluation: true },
    });

    if (!essay) {
      return NextResponse.json({ error: "Essay not found" }, { status: 404 });
    }

    return NextResponse.json({
      essay: {
        ...essay,
        createdAt: essay.createdAt.toISOString(),
        evaluation: essay.evaluation
          ? {
              ...essay.evaluation,
              createdAt: essay.evaluation.createdAt.toISOString(),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("GET /api/essays/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
