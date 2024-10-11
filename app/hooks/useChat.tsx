import { useState, useEffect, useCallback } from "react";
import { database } from "@/lib/firebase-client";
import { ref, onValue } from "firebase/database";
import { useSession } from "next-auth/react";

import type { TMessage, TUser, TRoom } from "@/types/chat";

export const useChat = () => {
    const realtimeDb = database;
    const { data: session } = useSession();
    const [messages, setMessages] = useState<{ [key: string]: TMessage[] }>({});
    const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: boolean }>({});
    const [recipient, setRecipient] = useState<TUser | null>(null);
    const [message, setMessage] = useState<string>("");
    const [rooms, setRooms] = useState<TRoom[]>([]);

    const listenForNewMessages = useCallback((roomId: string) => {
        const messagesRef = ref(realtimeDb, `messages/${roomId}`);
        onValue(messagesRef, (snapshot) => {
            const messages = snapshot.val();
            if (messages) {
                const loadedMessages = Object.keys(messages).map((key) => ({
                    ...messages[key],
                    id: key,
                }));

                loadedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [roomId]: loadedMessages,
                }));

                setUnreadMessages((prevUnreadMessages) => ({
                    ...prevUnreadMessages,
                    [roomId]: true,
                }));
            }
        });
    }, [realtimeDb]);


    useEffect(() => {
        if (session?.user?.id) {
            const userRoomsRef = ref(realtimeDb, `users/${session?.user?.id}/rooms`);
            onValue(userRoomsRef, (snapshot) => {
                const rooms = snapshot.val();
                if (rooms) {
                    const loadedRooms = Object.keys(rooms).map((key) => ({
                        recipientId: rooms[key].recipientId,
                        recipientName: rooms[key].recipientName,
                        recipientImage: rooms[key].recipientImage,
                        lastMessage: rooms[key].lastMessage,
                        lastMessageTimestamp: rooms[key].lastMessageTimestamp,
                        unreadMessages: rooms[key].unreadMessages
                    }));
                    setRooms(loadedRooms);
                }
            });
        }
    }, [session?.user?.id, realtimeDb]);
    

    const joinRoom = async (recipient: TUser) => {
        try {
            const roomId = [session?.user?.id, recipient.id].sort().join("_");

            setRecipient(recipient);

            const res = await fetch(`/api/rooms/${roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    userName: session?.user?.name,
                    userImage: session?.user?.image,
                    recipientId: recipient.id,
                    recipientName: recipient.name,
                    recipientImage: recipient.image,
                }),
            });

            if (!res.ok) throw new Error("Failed to join room");

            listenForNewMessages(roomId); 
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    };

    const sendMessage = async () => {
        if (message.trim() && recipient) {
            try {
                const roomId = [session?.user?.id, recipient.id].sort().join("_");
    
                const res = await fetch(`/api/messages/${roomId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: session?.user?.id,
                        message,
                    }),
                });
    
                if (!res.ok) throw new Error("Failed to send message");
    
                setMessage("");  
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };
    

    return {
        messages, 
        unreadMessages,
        joinRoom,
        sendMessage,
        message,
        setMessage, 
        recipient,
        setRecipient,
        rooms, 
    };
};
