import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const decoded = jwtDecode(token);
  const role = decoded.role;
  const path = request.nextUrl.pathname;
  console.log("Middleware: Role -", role, "Path -", path);
  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/faculty") && role !== "FACULTY") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/faculty/:path*", "/student/:path*"]
};