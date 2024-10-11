import { database } from "@/lib/firebase-client";
import { ref, push, get } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
    const { roomId } = params;

    try {
        const messageRef = ref(database, `messages/${roomId}`);
        const messagesSnapshot = await get(messageRef);
        const messages = messagesSnapshot.val();

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    const body = await request.json();
    const { senderId, message } = body;


    try {
        const messageRef = ref (database, `messages/${roomId}`);
        await push(messageRef, {
            senderId,
            message,
            timestamp: new Date().toISOString(),
        })
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
