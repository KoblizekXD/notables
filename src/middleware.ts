import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.next();
  const session = await auth.api.getSession({ headers: await headers() });
  if (request.nextUrl.pathname.startsWith("/sign")) {
    if (session) return NextResponse.redirect(new URL("/home", request.url));
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/home", "/sign-in", "/sign-up", "/error"],
};
