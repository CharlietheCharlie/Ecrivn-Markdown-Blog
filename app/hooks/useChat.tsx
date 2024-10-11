// useChat.ts
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom, listenForMessages, fetchUserRooms } from '../store/chatAction';
import { useSession } from 'next-auth/react';
import { TChatState, TUser } from '@/types/chat';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../store/store';

export const useChat = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();
    const { rooms, unreadMessages, messages } = useSelector((state: any) => state.chat) as TChatState;

    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState<TUser | null>(null);
    const [currentRoomId, setCurrentRoomId] = useState<string>('');

    useEffect(() => {
        if (session?.user?.id) {
            dispatch(fetchUserRooms(session.user.id));
        }
    }, [session, dispatch]);

    const handleJoinRoom = (selectedRecipient: TUser) => {
        setRecipient(selectedRecipient);
        if (session?.user) {
            dispatch(joinRoom({ session: { user: session.user as TUser }, recipient: selectedRecipient }));
            const roomId = [session.user.id, selectedRecipient.id].sort().join("_");
            setCurrentRoomId(roomId);
            handleListenForMessages(roomId);
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && session?.user && recipient) {
            const roomId = [session.user.id, recipient.id].sort().join("_");

            try {
                const res = await fetch(`/api/messages/${roomId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        senderId: session.user.id,
                        message,
                    }),
                });

                if (!res.ok) throw new Error("Error sending message");

                setMessage(''); 
            } catch (error) {
                console.error("Error：", error);
            }
        }
    };

    const handleListenForMessages = (roomId: string) => {
        dispatch(listenForMessages(roomId));
    };

    const currentMessages = messages[currentRoomId] || [];

    return {
        messages: currentMessages,
        recipient,
        message,
        rooms,
        unreadMessages,
        setMessage,
        setRecipient,
        joinRoom: handleJoinRoom,
        sendMessage: handleSendMessage,
        listenForMessages: handleListenForMessages,
    };
};
