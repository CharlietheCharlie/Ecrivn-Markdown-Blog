import { createSlice } from '@reduxjs/toolkit';
import { joinRoom } from './chatAction';
import type { TChatState } from '@/types/chat';

const initialState: TChatState = {
  rooms: [],
  unreadMessages: {},
  messages: {}, 
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRooms(state, action) {
      state.rooms = action.payload;
    },
    setUnreadMessages(state, action) {
      state.unreadMessages = action.payload;
    },
    setMessages(state, action) {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinRoom.fulfilled, (state, action) => {
        const { recipient } = action.payload;
        const roomExists = state.rooms.some(room => room.recipientId === recipient.id);
        if (!roomExists) {
          state.rooms.push({
            recipientId: recipient.id,
            recipientName: recipient.name,
            recipientImage: recipient.image,
            lastMessage: '',
            lastMessageTimestamp: '',
            unreadMessages: false,
          });
        }
      })
      .addCase(joinRoom.rejected, (state) => {
        console.log('Error joining room');
      });
  },
});

export const { setRooms, setUnreadMessages, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
