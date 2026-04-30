const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return Response.json(data, { status: backendRes.status });
  } catch {
    return Response.json(
      { error: "Unable to send your enquiry right now. Please try again shortly." },
      { status: 502 }
    );
  }
}
