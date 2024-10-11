import { database } from "@/lib/firebase-client";
import { ref, get, set, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    const { userId, userName, userImage, recipientId, recipientName, recipientImage } = await req.json();

    if (!userId || !userName || !recipientId || !recipientName) {
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
                        image: userImage || "",
                    },
                    [recipientId]: {
                        name: recipientName,
                        image: recipientImage || "",
                    }
                }
            });
        }

        const userRoomRef = ref(database, `users/${userId}/rooms/${roomId}`);
        const userRoomSnapshot = await get(userRoomRef);

        if (!userRoomSnapshot.exists()) {
            await set(userRoomRef, {
                recipientId: recipientId,
                recipientName: recipientName,
                recipientImage: recipientImage || "",
                lastMessage: "",
                lastMessageTimestamp: "",
                unreadMessages: false,
            });
        }

        const recipientRoomRef = ref(database, `users/${recipientId}/rooms/${roomId}`);
        const recipientRoomSnapshot = await get(recipientRoomRef);

        if (!recipientRoomSnapshot.exists()) {
            await set(recipientRoomRef, {
                recipientId: userId,
                recipientName: userName,
                recipientImage: userImage || "",
                lastMessage: "",
                lastMessageTimestamp: "",
                unreadMessages: false,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error creating room:", error);
        return NextResponse.json({ error: `Failed to create room: ${error.message}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { roomId: string } }) {
    const { roomId } = params;
    const {
        lastMessage,
        lastMessageTimestamp,
        userId,
        recipientId,
        unreadMessagesForUser,
        unreadMessagesForRecipient
    } = await req.json();

    if (!lastMessage || !lastMessageTimestamp || !userId || !recipientId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const userRoomRef = ref(database, `users/${userId}/rooms/${roomId}`);
        const userRoomSnapshot = await get(userRoomRef);
        const userRoomData = userRoomSnapshot.val() || {};

        await update(userRoomRef, {
            ...userRoomData,
            lastMessage,
            lastMessageTimestamp,
            unreadMessages: unreadMessagesForUser,
        });

        const recipientRoomRef = ref(database, `users/${recipientId}/rooms/${roomId}`);
        const recipientRoomSnapshot = await get(recipientRoomRef);
        const recipientRoomData = recipientRoomSnapshot.val() || {};

        await update(recipientRoomRef, {
            ...recipientRoomData,
            lastMessage,
            lastMessageTimestamp,
            unreadMessages: unreadMessagesForRecipient,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error updating room:", error);
        return NextResponse.json({ error: `Failed to update room: ${error.message}` }, { status: 500 });
    }
}
