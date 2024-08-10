import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
});
export const config = {
  matcher: "/about/:path*",
};
