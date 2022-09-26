import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  nearbyPeople: [],
  myFriends: [],
  friendToSearch: '',
  usersBySearchModes: {},
  receivedRequests: [],
  sendRequests: [],
  applyPressed: 0,
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    updateNearbyPeople: (state, action) => {
      state.nearbyPeople = action.payload.nearbyPeople;
    },
    updateUsersBySearchModes: (state, action) => {
      state.usersBySearchModes = action.payload.usersBySearchModes;
    },
    updateMyFriends: (state, action) => {
      state.myFriends = action.payload.myFriends;
    },
    updateReceivedRequests: (state, action) => {
      state.receivedRequests = [...action.payload.requests];
    },
    updateSendRequests: (state, action) => {
      state.sendRequests = [...action.payload.sent];
    },
    searchFriend: (state, action) => {
      state.friendToSearch = action.payload.friendToSearch;
    },
    applyPressed: (state, action) => {
      state.applyPressed = state.applyPressed + 1;
      console.log('state.applyPressed: ', state.applyPressed);
    },
    clearPeopleSlice: state => initialState,
  },
});

export const {
  searchFriend,
  updateNearbyPeople,
  updateMyFriends,
  updateSendRequests,
  updateUsersBySearchModes,
  updateReceivedRequests,
  applyPressed,
  clearPeopleSlice,
} = peopleSlice.actions;

export default peopleSlice.reducer;
