import { firestore } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore"; 

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
    const { roomId } = params;

    try {
        const messagesSnapshot = await firestore.collection('messages')
            .where('roomId', '==', roomId)
            .get();

        const messages = messagesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                timestamp: data.timestamp.toDate().toISOString(),
            };
        });

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    const body = await request.json();
    const { sender, message } = body;

    try {
        await firestore.collection("messages").add({
            roomId,
            sender,
            message,
            timestamp: Timestamp.now(),
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
