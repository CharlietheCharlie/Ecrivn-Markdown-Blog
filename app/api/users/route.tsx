import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase"; // 假設你已經初始化了 firebase

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
        return NextResponse.json({ error: "No name provided" }, { status: 400 });
    }
    try {
        const usersSnapshot = await firestore
            .collection("users")
            .orderBy("name") 
            .startAt(name)
            .endAt(name + "\uf8ff") 
            .get();
        const users = usersSnapshot.docs.map((doc) => doc.data());
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
