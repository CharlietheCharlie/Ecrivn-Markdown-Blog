import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: {},

};

const chatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    reducers: {
        addMessage: (state, action) => {
        },
    },
});

export default chatSlice.reducer;