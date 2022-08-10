/* eslint-disable no-unused-vars */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rawText: {},
  status: 'disconnected',
  myLatitude: 0,
  myLongitude: 0,
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
      console.log(`status changed to ${state.status}`);
    },
    getConstants: () => {
      console.log('GETTING CONSTENTS...');
    },
    setMyLocation: (state, action) => {
      console.log('3');
      state.myLatitude = action.payload.myLatitude;
      state.myLongitude = action.payload.myLongitude;
      console.log(
        `IN STATE         myLatitude: ${state.myLatitude}, myLongitude: ${state.myLongitude}`,
      );
    },
  },
});

export const {rawText, changeStatus, getConstants, setMyLocation} =
  generalSlice.actions;

export default generalSlice.reducer;
