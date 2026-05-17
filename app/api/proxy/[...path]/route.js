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

  // For multipart uploads (photo batches), stream the request body directly to
  // the backend instead of buffering the entire payload in memory first.
  // This halves effective upload time — the backend starts receiving bytes while
  // the browser is still sending, rather than waiting for the full upload to land
  // in the proxy before forwarding begins.
  // For all other content types (JSON, form-urlencoded) buffer as before so we
  // can safely handle empty bodies.
  let body = undefined;
  if (hasBody) {
    const ct = request.headers.get("content-type") || "";
    if (ct.startsWith("multipart/form-data")) {
      body = request.body; // ReadableStream — no memory buffer
    } else {
      const buf = await request.arrayBuffer();
      if (buf.byteLength > 0) body = buf;
    }
  }

  let backendRes;
  try {
    // duplex:"half" is required by the fetch spec when body is a ReadableStream.
    const fetchInit = { method, headers: outHeaders, body };
    if (body && typeof body.getReader === "function") fetchInit.duplex = "half";
    backendRes = await fetch(targetUrl, fetchInit);
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
