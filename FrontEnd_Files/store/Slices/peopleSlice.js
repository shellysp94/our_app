import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  nearbyPeople: [],
  myFriends: [],
  friendToSearch: '',
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    updateNearbyPeople: (state, action) => {
      state.nearbyPeople = action.payload.nearbyPeople;
    },
    updateMyFriends: (state, action) => {
      state.myFriends = action.payload.myFriends;
    },
    searchFriend: (state, action) => {
      state.friendToSearch = action.payload.friendToSearch;
    },
  },
});

export const {updateNearbyPeople, updateMyFriends, searchFriend} =
  peopleSlice.actions;

export default peopleSlice.reducer;
