import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_LB_BACKEND_URL || "http://t10868f0sd4tlemfrh4oo82q.213.199.42.255.sslip.io";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const res = await fetch(`${BACKEND_URL}/api/widget/token/${token}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch token config" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying token config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
