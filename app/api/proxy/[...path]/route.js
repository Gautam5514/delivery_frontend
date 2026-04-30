import { cookies } from "next/headers";

// Prevent Next.js from caching any proxy response — every request must hit the backend.
export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const SESSION_COOKIE = "gopo_session";

// Headers that must not be forwarded between hops (RFC 7230 §6.1).
const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailers", "transfer-encoding", "upgrade",
  "host",
]);

async function proxy(request, context) {
  const { path } = await context.params;
  const segment = Array.isArray(path) ? path.join("/") : path;

  // Preserve query string from the original request
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const targetUrl = `${BACKEND}/${segment}${qs ? `?${qs}` : ""}`;

  // Read the auth token from the HttpOnly cookie — never from client JS
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;

  // Build a clean header set for the backend request
  const outHeaders = new Headers();

  // Forward Content-Type exactly as received (multipart boundaries must be preserved)
  const contentType = request.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);

  // Inject auth header sourced from the secure cookie
  if (token) outHeaders.set("authorization", `Bearer ${token}`);

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  // Read the request body into an ArrayBuffer so it can be forwarded reliably
  // across all content types (JSON, multipart/form-data, binary blobs).
  let body = undefined;
  if (hasBody) {
    body = await request.arrayBuffer();
    if (body.byteLength === 0) body = undefined;
  }

  let backendRes;
  try {
    backendRes = await fetch(targetUrl, {
      method,
      headers: outHeaders,
      body,
    });
  } catch (networkError) {
    console.error("[proxy] Backend unreachable:", networkError.message);
    return new Response(
      JSON.stringify({ error: "Backend service is unavailable. Please try again." }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  // Forward all safe backend response headers to the client
  const resHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      resHeaders.set(key, value);
    }
  });

  // Stream the response body — this handles JSON, binary ZIP, and image blobs
  // without loading the entire payload into memory.
  return new Response(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers: resHeaders,
  });
}

export const GET    = proxy;
export const POST   = proxy;
export const PUT    = proxy;
export const PATCH  = proxy;
export const DELETE = proxy;
