import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '@/lib/firebase-client';
import { ref, onValue } from 'firebase/database';
import type { TRoom } from '@/types/chat';

export const loadRooms = createAsyncThunk('chat/loadRooms', async (userId: string) => {
    const userRoomsRef = ref(database, `users/${userId}/rooms`);
    return new Promise<TRoom[]>((resolve, reject) => {
      onValue(userRoomsRef, (snapshot) => {
        const rooms = snapshot.val();
        if (rooms) {
          const loadedRooms = Object.keys(rooms).map((key) => ({
            recipientId: rooms[key].recipientId,
            recipientName: rooms[key].recipientName,
            recipientImage: rooms[key].recipientImage,
            lastMessage: rooms[key].lastMessage,
            lastMessageTimestamp: rooms[key].lastMessageTimestamp,
            unreadMessages: rooms[key].unreadMessages,
          }));
          resolve(loadedRooms);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject(error);
      });
    });
  });