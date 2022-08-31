import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rawText: {},
  status: 'disconnected',
  myLatitude: 0,
  myLongitude: 0,
  myStatus: '',
  myNotification: [],
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    getRawText: (state, action) => {
      state.rawText = action.payload.rawText;
      console.log('in state setRaw');
    },
    setNotificatation: (state, action) => {
      state.myNotification = action.payload.myNotification;
    },
    changeStatus: (state, action) => {
      state.status = action.payload.status;
      console.log(`status changed to ${state.status}`);
    },
    // getConstants: () => {
    //   console.log('GETTING CONSTENTS...');
    // },
    setMyLocation: (state, action) => {
      console.log('3');
      state.myLatitude = action.payload.myLatitude;
      state.myLongitude = action.payload.myLongitude;
      console.log(
        `IN STATE         myLatitude: ${state.myLatitude}, myLongitude: ${state.myLongitude}`,
      );
    },
    updateMyStatus: (state, action) => {
      state.myStatus = action.payload.status;
    },
  },
});

export const {
  getRawText,
  setNotificatation,
  changeStatus,
  getConstants,
  setMyLocation,
  updateMyStatus,
} = generalSlice.actions;

export default generalSlice.reducer;
