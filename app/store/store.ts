import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import thunk from "redux-thunk";

export default configureStore({
    reducer: {
        chat: chatReducer
    },
})

