import { database } from "@/lib/firebase-client";
import { ref, get, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    const { userId, userName, userImage, recipientId, recipientName, recipientImage } = await req.json();

    if (!userId || !userName || !userImage || !recipientId || !recipientName || !recipientImage) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    try {
        const roomRef = ref(database, `rooms/${roomId}`);
        const roomSnapshot = await get(roomRef);

        if (!roomSnapshot.exists()) {
            await set(roomRef, {
                createdAt: new Date().toISOString(),
                participants: {
                    [userId]: {
                        name: userName,
                        image: userImage
                    },
                    [recipientId]: {
                        name: recipientName,
                        image: recipientImage
                    }
                }
            });
        }

        const userRoomRef = ref(database, `users/${userId}/rooms/${roomId}`);
        await set(userRoomRef, {
            recipientId: recipientId,
            recipientName: recipientName,
            recipientImage: recipientImage,
            lastMessage: "",  
            lastMessageTimestamp: "",
            unreadMessages: false,
        });

        const recipientRoomRef = ref(database, `users/${recipientId}/rooms/${roomId}`);
        await set(recipientRoomRef, {
            recipientId: userId,
            recipientName: userName,
            recipientImage: userImage, 
            lastMessage: "",
            lastMessageTimestamp: "",
            unreadMessages: false,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}
