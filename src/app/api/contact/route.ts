import { NextResponse } from "next/server";
import { PROFILE } from "@/data/portfolio";

interface ContactPayload {
  service?: string;
  name?: string;
  email?: string;
  brief?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const service = (body.service || "General Inquiry").trim();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const brief = (body.brief || "").trim();

    if (!name || !email || !brief) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and project brief are required." },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Brief <onboarding@resend.dev>",
          to: [PROFILE.email],
          reply_to: email,
          subject: `[Portfolio Brief] ${service} — ${name}`,
          text: `Service: ${service}\nClient: ${name} (${email})\n\nBrief:\n${brief}`,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ ok: true, mode: "resend" });
      }
    }

    return NextResponse.json({
      ok: true,
      mode: "logged",
      recipient: PROFILE.email,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
