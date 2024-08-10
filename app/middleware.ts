import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  throw new Error("Not implemented");
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
});
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
 };
