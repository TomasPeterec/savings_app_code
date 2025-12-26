import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("CRON RUNNING");

  return NextResponse.json({ ok: true });
}
