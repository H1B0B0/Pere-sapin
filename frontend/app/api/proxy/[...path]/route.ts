import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:5042";

export async function GET(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const apiPath = pathname.replace("/api/proxy", "");

  try {
    const response = await fetch(`${BACKEND_URL}${apiPath}${search}`, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const apiPath = pathname.replace("/api/proxy", "");
  const body = await request.text();

  try {
    const response = await fetch(`${BACKEND_URL}${apiPath}${search}`, {
      method: "POST",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const apiPath = pathname.replace("/api/proxy", "");
  const body = await request.text();

  try {
    const response = await fetch(`${BACKEND_URL}${apiPath}${search}`, {
      method: "PATCH",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname, search } = new URL(request.url);
  const apiPath = pathname.replace("/api/proxy", "");

  try {
    const response = await fetch(`${BACKEND_URL}${apiPath}${search}`, {
      method: "DELETE",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }
}
