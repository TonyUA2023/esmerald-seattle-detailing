import { NextResponse } from "next/server";
import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_LB_BACKEND_URL || "https://t10868f0sd4tlemfrh4oo82q.213.199.42.255.sslip.io";

export async function POST(request: Request) {
  try {
    const { chatId, tenantId, content } = await request.json();

    if (!chatId || !content) {
      return NextResponse.json({ error: "chatId and content are required" }, { status: 400 });
    }

    // Connect server-to-server to LeadBridge IA via Socket.io
    const aiResponse = await new Promise<{ text: string; sender: string }>((resolve, reject) => {
      const s = io(BACKEND_URL, {
        transports: ["websocket", "polling"],
        reconnection: false,
      });

      let timeoutId: NodeJS.Timeout;

      s.on("connect", () => {
        s.emit("join_chat", { chatId });
        setTimeout(() => {
          s.emit("send_message", {
            chatId,
            tenantId,
            senderType: "LEAD",
            content,
          });
        }, 200);
      });

      s.on("new_message", (msg: { senderType: string; content: string }) => {
        if (msg.senderType === "AI" || msg.senderType === "WORKER") {
          clearTimeout(timeoutId);
          s.disconnect();
          resolve({ text: msg.content, sender: msg.senderType });
        }
      });

      s.on("connect_error", (err) => {
        clearTimeout(timeoutId);
        s.disconnect();
        reject(err);
      });

      timeoutId = setTimeout(() => {
        s.disconnect();
        reject(new Error("AI response timeout after 15 seconds"));
      }, 15000);
    });

    return NextResponse.json({ success: true, message: aiResponse });
  } catch (error: any) {
    console.error("[LeadBridge Message Proxy Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process message" }, { status: 500 });
  }
}
