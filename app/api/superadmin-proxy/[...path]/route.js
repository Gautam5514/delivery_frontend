import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
const SESSION_COOKIE = "gopo_sa_session";

const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailers", "transfer-encoding", "upgrade",
  "host",
]);

async function proxy(request, context) {
  const { path } = await context.params;
  const segment = Array.isArray(path) ? path.join("/") : path;

  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  const targetUrl = `${BACKEND}/${segment}${qs ? `?${qs}` : ""}`;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;

  const outHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) outHeaders.set("content-type", contentType);
  if (token) outHeaders.set("authorization", `Bearer ${token}`);

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  let body = undefined;
  if (hasBody) {
    body = await request.arrayBuffer();
    if (body.byteLength === 0) body = undefined;
  }

  let backendRes;
  try {
    backendRes = await fetch(targetUrl, { method, headers: outHeaders, body });
  } catch (networkError) {
    console.error("[superadmin-proxy] Backend unreachable:", networkError.message);
    return new Response(
      JSON.stringify({ error: "Backend service is unavailable. Please try again." }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  const resHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) resHeaders.set(key, value);
  });

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
