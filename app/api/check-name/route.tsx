import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase"; 
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ available: false, message: "Name is required" }, { status: 400 });
  }

  const nameExist = await firestore.collection("users").where("name_lowercase", "==", name?.toLowerCase()).get();

  if (nameExist.size > 0) {
    return NextResponse.json({ available: false }, { status: 200 });
  }

  return NextResponse.json({ available: true }, { status: 200 });
}
