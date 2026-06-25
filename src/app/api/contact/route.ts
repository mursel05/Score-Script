import { NextRequest, NextResponse } from "next/server";
import { createContactSchema } from "@/src/lib/validations";
import { prisma } from "@/src/lib/prisma";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = createContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsed.error), success: false },
        { status: 400 }
      );
    }

    const { subject, message, email } = parsed.data;

    const text = `Yeni mesaj:\n\nMövzu: ${subject}\nMesaj: ${message}\nİstifadəçi E-poçtu: ${email}`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`
    );

    await prisma.contact.create({
      data: {
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("POST /api/essays error:", error);
    return NextResponse.json({ error: "Server xətası", success: false }, { status: 500 });
  }
}
