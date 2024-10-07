import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ratelimit } from "./lib/upstash";

export async function middleware(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.ip ||
      "0.0.0.0";

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // if (!token && req.nextUrl.pathname !== "/login") {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }

    return NextResponse.next();
  } catch (error) {
    console.log('Middleware error:', error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
