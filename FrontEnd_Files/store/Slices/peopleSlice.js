import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  nearbyPeople: [],
  myFriends: [],
  friendToSearch: '',
  usersBySearchModes: {},
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
    searchFriend: (state, action) => {
      state.friendToSearch = action.payload.friendToSearch;
    },
  },
});

export const {
  updateNearbyPeople,
  updateMyFriends,
  searchFriend,
  updateUsersBySearchModes,
} = peopleSlice.actions;

export default peopleSlice.reducer;
