import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userConfig: {},
  email: '',
  fullName: '',
  token: '',
  searchMode: 'Whatever',
  myHobbies: [],
  filters: {
    search_mode_filter: 'Whatever',
    hobbies_filter: 'Hobbies',
    gender_filter: 'Gender',
    relationship_filter: 'Relationship',
    interested_in_filter: 'Interested in',
    age_filter: [],
    friends_only_filter: 0,
    radius_filter: 500,
  },
};

export const configurationSlice = createSlice({
  name: 'configer',
  initialState,
  reducers: {
    updateDetails: (state, action) => {
      state.userConfig = action.payload.userConfig;
      state.email = action.payload.email;
      state.fullName = action.payload.fullName;
      state.token = action.payload.token;
    },
    updateMainPictuer: (state, action) => {
      const userConfig = {...state.userConfig, image: action.payload.image};
      state.userConfig = userConfig;
    },
    updateSearchMode: (state, action) => {
      state.searchMode = action.payload.searchMode;
    },
    updateHobbies: (state, action) => {
      state.myHobbies = action.payload.myHobbies;
    },
    updateFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: state => {
      state.filters = initialState.filters;
      console.log('changed');
    },
    clearHobbies: (state, action) => {
      state.myHobbies = [];
    },
  },
});

export const {
  updateDetails,
  updateMainPictuer,
  updateSearchMode,
  updateHobbies,
  updateFilters,
  clearFilters,
  clearHobbies,
} = configurationSlice.actions;

export default configurationSlice.reducer;
