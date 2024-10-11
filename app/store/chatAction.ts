import { createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "@/lib/firebase-client";
import { ref, onValue } from "firebase/database";
import type { TMessage, TUser } from "@/types/chat";
import { setMessages } from './chatSlice';

export const joinRoom = createAsyncThunk(
  "chat/joinRoom",
  async (
    { session, recipient }: { session: { user: TUser }; recipient: TUser },
    { rejectWithValue }
  ) => {
    try {
      const roomId = [session.user.id, recipient.id].sort().join("_");

      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name,
          userImage: session.user.image,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientImage: recipient.image,
        }),
      });

      if (!res.ok) throw new Error("Failed to join room");

      return { roomId, recipient };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to join room");
    }
  }
);

export const fetchUserRooms = createAsyncThunk(
  "chat/fetchUserRooms",
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      const userRoomsRef = ref(database, `users/${userId}/rooms`);

      onValue(
        userRoomsRef,
        (snapshot) => {
          const userRooms = snapshot.val();
          if (userRooms) {
            const loadedUserRooms = Object.keys(userRooms).map((key) => ({
              ...userRooms[key],
              id: key,
            }));

            dispatch({
              type: "chat/setRooms",
              payload: loadedUserRooms,
            });

          }
        },
        (error) => {
          console.error("Fetch user rooms error:", error);
        }
      );
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user rooms");
    }
  }
);

export const listenForMessages = (roomId: string) => {
  return (dispatch: any) => {
    const messagesRef = ref(database, `messages/${roomId}`);

    onValue(
      messagesRef,
      (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const loadedMessages = Object.keys(messagesData).map((key) => ({
            ...messagesData[key],
            id: key,
          }));
          loadedMessages.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          dispatch(setMessages({ roomId, messages: loadedMessages }));
        }
      },
      (error) => {
        console.error("Listen for messages error:", error);
      }
    );
  };
};
