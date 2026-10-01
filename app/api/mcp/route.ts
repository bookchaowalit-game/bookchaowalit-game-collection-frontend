import { NextRequest } from "next/server";
import { handleRpc, RPC_ERRORS } from "@/lib/mcp";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  let message: unknown;
  try {
    message = await request.json();
  } catch {
    return Response.json(
      { jsonrpc: "2.0", id: null, error: { code: RPC_ERRORS.parseError, message: "Parse error" } },
      { status: 400 },
    );
  }

  const response = handleRpc(message);
  if (response === null) {
    // JSON-RPC notification: acknowledge without a body.
    return new Response(null, { status: 202 });
  }
  return Response.json(response);
}
