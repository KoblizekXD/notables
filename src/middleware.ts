import type { auth } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.next();
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (request.nextUrl.pathname.startsWith("/sign")) {
    if (session) return NextResponse.redirect(new URL("/home", request.url));
    return NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));

  return NextResponse.next();

  // if (request.nextUrl.pathname.startsWith("/api/auth"))
  //   return NextResponse.next();
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (request.nextUrl.pathname.startsWith("/sign")) {
  //   if (session) return NextResponse.redirect(new URL("/home", request.url));
  //   return NextResponse.next();
  // }
  // if (!session) return NextResponse.redirect(new URL("/sign-in", request.url));
  // return NextResponse.next();
}

export const config = {
  // runtime: "nodejs",
  matcher: ["/home", "/sign-in", "/sign-up", "/error"],
};
