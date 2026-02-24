import { Resend } from "resend";
import { NextResponse } from "next/server";

const briefQuestions = [
  { id: "brandbook", question: "Фирменный стиль / брендбук существует?" },
  { id: "spec", question: "Техническое задание уже есть?" },
];

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  for (const v of Object.values(value as Record<string, unknown>)) {
    if (typeof v !== "string") return false;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO ?? "alekseevpo@gmail.com";

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!from) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_FROM" },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => null)) as unknown;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const answers = (body as { answers?: unknown }).answers;
    const files = (body as { files?: unknown }).files;

    if (!isRecordOfStrings(answers)) {
      return NextResponse.json(
        { ok: false, error: "Invalid answers" },
        { status: 400 }
      );
    }

    const lines: string[] = [];
    for (const [key, value] of Object.entries(answers)) {
      lines.push(`${key}: ${value}`);
    }

    // Добавляем информацию о файлах
    if (files && typeof files === "object") {
      lines.push("\n--- Прикреплённые файлы ---");
      for (const [questionId, fileList] of Object.entries(files as Record<string, unknown>)) {
        if (Array.isArray(fileList)) {
          const question = briefQuestions.find((q) => q.id === questionId);
          lines.push(`\n${question?.question || questionId}:`);
          for (const file of fileList as Array<{ name: string; type: string; size: number }>) {
            lines.push(`  - ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)} KB)`);
          }
        }
      }
    }

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: "Бриф lebkuchen.ru",
      text: lines.join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
