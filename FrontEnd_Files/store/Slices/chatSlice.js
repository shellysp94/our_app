import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  OpenChats: [],
  currChat: [],
};

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    openChats: (state, action) => {
      state.OpenChats = action.payload.OpenChats;
    },
    setCurrentChat: (state, action) => {
      state.currChat = action.payload.currChat;
    },
  },
});

export const {openChats, setCurrentChat} = chatSlice.actions;

export default chatSlice.reducer;
