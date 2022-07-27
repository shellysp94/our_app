import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  OpenChats: [],
  currChat: [],
  newMessage: false,
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
    newMessageWaiting: (state, action) => {
      state.newMessage = action.payload.newMessage;
      console.log('new message state is: ', state.newMessage);
    },
  },
});

export const {openChats, setCurrentChat} = chatSlice.actions;

export default chatSlice.reducer;
