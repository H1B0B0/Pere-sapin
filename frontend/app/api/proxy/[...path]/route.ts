import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:5042";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, params, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string,
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const url = `${API_BASE_URL}/${path}`;

    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Cookie: authToken ? `auth-token=${authToken.value}` : "",
    };

    // Copy relevant headers from the original request
    const forwardedHeaders = ["authorization", "content-type", "accept"];

    forwardedHeaders.forEach((headerName) => {
      const headerValue = request.headers.get(headerName);

      if (headerValue && headerName !== "content-type") {
        headers[headerName] = headerValue;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    // Add body for non-GET requests
    if (method !== "GET" && method !== "DELETE") {
      const contentType = request.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        requestOptions.body = JSON.stringify(await request.json());
      } else if (contentType?.includes("multipart/form-data")) {
        requestOptions.body = await request.formData();
        // Remove content-type header for FormData (let fetch set it)
        delete (headers as any)["Content-Type"];
      } else {
        requestOptions.body = await request.text();
      }
    }

    // Make the request to the backend
    const response = await fetch(url, requestOptions);

    // Get response data
    const contentType = response.headers.get("content-type");
    let responseData;
    let responseHeaders: HeadersInit = {};

    if (contentType?.includes("application/json")) {
      const jsonData = await response.json();
      responseData = JSON.stringify(jsonData);
      responseHeaders["content-type"] = "application/json";
    } else if (
      contentType?.includes("application/pdf") ||
      contentType?.includes("application/octet-stream")
    ) {
      responseData = await response.arrayBuffer();
      if (contentType) responseHeaders["content-type"] = contentType;
    } else {
      responseData = await response.text();
      if (contentType) responseHeaders["content-type"] = contentType;
    }

    // Create the Next.js response
    const nextResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

    // Forward additional headers (content-type is already handled above)
    const additionalHeaders = ["content-disposition", "cache-control"];
    
    additionalHeaders.forEach((headerName) => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        nextResponse.headers.set(headerName, headerValue);
      }
    });

    // Handle cookies from backend response
    const setCookieHeaders = response.headers.get("set-cookie");

    if (setCookieHeaders) {
      // Forward all Set-Cookie headers from backend
      nextResponse.headers.set("set-cookie", setCookieHeaders);
    }

    return nextResponse;
  } catch (error) {
    console.error(`Proxy error for ${method} request:`, error);

    return NextResponse.json(
      { error: "Internal proxy error" },
      { status: 500 },
    );
  }
}
