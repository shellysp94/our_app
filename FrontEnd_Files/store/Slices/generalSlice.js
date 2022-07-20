import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rawText: {},
  status: 'disconnected',
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    rawText: (state, action) => {
      state.rawText = action.payload.rawText;
    },
    changeStatus: (state, action) => {
      state.status = action.payload.status;
      console.log('status changed');
    },
  },
});

export const {rawText, changeStatus} = generalSlice.actions;

export default generalSlice.reducer;
