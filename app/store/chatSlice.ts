import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from "@/lib/firebase-client";
import { ref, onValue } from "firebase/database";
import { loadRooms } from './chatAction';
import type { TChatState } from '@/types/chat';

const initialState: TChatState = {
  messages: {},
  unreadMessages: {},
  recipient: null,
  rooms: [],
  message: "",
};



const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
    setRecipient(state, action) {
      state.recipient = action.payload;
    },
    setMessages(state, action) {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    setUnreadMessages(state, action) {
      const { roomId, unread } = action.payload;
      state.unreadMessages[roomId] = unread;
    },
    setRooms(state, action) {
      state.rooms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadRooms.fulfilled, (state, action) => {
      state.rooms = action.payload;
    });
  }
});

export const { setMessage, setRecipient, setMessages, setUnreadMessages, setRooms } = chatSlice.actions;

export default chatSlice.reducer;
