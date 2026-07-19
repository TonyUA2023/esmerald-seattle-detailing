import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_LB_BACKEND_URL || "http://t10868f0sd4tlemfrh4oo82q.213.199.42.255.sslip.io";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const res = await fetch(`${BACKEND_URL}/api/chats/${chatId}/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error proxying chat close:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
