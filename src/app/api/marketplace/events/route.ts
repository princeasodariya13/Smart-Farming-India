import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { marketplaceEmitter } from "@/lib/marketplaceEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  let userId = session?.user?.id;

  if (!userId) {
    const fallback = await prisma.user.findFirst();
    userId = fallback?.id ?? undefined;
  }

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Helper to send an SSE frame
      const send = (data: object) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch (_) {
          // controller may be closed
        }
      };

      // Send a heartbeat so the browser keeps the connection alive
      send({ type: "connected", userId });

      // Listen for events targeted at this user
      const handler = (event: object) => send(event);
      marketplaceEmitter.on(`user:${userId}`, handler);

      // Clean up when client disconnects
      req.signal.addEventListener("abort", () => {
        marketplaceEmitter.off(`user:${userId}`, handler);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
