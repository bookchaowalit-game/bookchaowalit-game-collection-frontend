import { GAMES, GAME_COUNT, gamePath } from "./games.ts";

/**
 * Minimal, stateless MCP (JSON-RPC 2.0) handler for the arcade. It exposes
 * read-only catalog data only; no user data, no side effects.
 */
export const PROTOCOL_VERSION = "2024-11-05";

export type JsonRpcId = number | string | null;

export type JsonRpcResponse =
  | { jsonrpc: "2.0"; id: JsonRpcId; result: unknown }
  | { jsonrpc: "2.0"; id: JsonRpcId; error: { code: number; message: string } };

export const RPC_ERRORS = {
  parseError: -32700,
  invalidRequest: -32600,
  methodNotFound: -32601,
  invalidParams: -32602,
} as const;

const TOOLS = [
  {
    name: "list_games",
    description: `List the ${GAME_COUNT} playable Book Arcade games with their paths.`,
    inputSchema: { type: "object", properties: {} },
  },
];

function rpcError(id: JsonRpcId, code: number, message: string): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Handle one decoded JSON-RPC message. Returns null for notifications
 * (messages without an id), which must not receive a response.
 */
export function handleRpc(message: unknown): JsonRpcResponse | null {
  if (!isObject(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    const id = isObject(message) && (typeof message.id === "string" || typeof message.id === "number") ? message.id : null;
    return rpcError(id, RPC_ERRORS.invalidRequest, "Invalid Request");
  }

  const isNotification = !("id" in message);
  const id: JsonRpcId =
    typeof message.id === "string" || typeof message.id === "number" ? message.id : null;
  const params = isObject(message.params) ? message.params : {};

  let response: JsonRpcResponse;
  switch (message.method) {
    case "initialize":
      response = {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: "book-arcade", version: "0.1.0" },
        },
      };
      break;
    case "ping":
      response = { jsonrpc: "2.0", id, result: {} };
      break;
    case "tools/list":
      response = { jsonrpc: "2.0", id, result: { tools: TOOLS } };
      break;
    case "tools/call": {
      if (params.name !== "list_games") {
        response = rpcError(id, RPC_ERRORS.invalidParams, `Unknown tool: ${String(params.name)}`);
        break;
      }
      const games = GAMES.map((game) => ({
        number: game.number,
        title: game.title,
        summary: game.summary,
        path: gamePath(game.slug),
      }));
      response = {
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(games) }] },
      };
      break;
    }
    default:
      response = rpcError(id, RPC_ERRORS.methodNotFound, `Method not found: ${message.method}`);
  }

  return isNotification ? null : response;
}
