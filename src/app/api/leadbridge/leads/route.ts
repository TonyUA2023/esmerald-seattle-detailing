import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_LB_BACKEND_URL || "https://t10868f0sd4tlemfrh4oo82q.213.199.42.255.sslip.io";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error proxying lead registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
