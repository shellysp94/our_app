import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userConfig: {},
  signUpConfig: {},
  email: '',
  fullName: '',
  token: '',
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
    online_filter: true,
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
    updateConfiguration: (state, action) => {
      const signUp = action.payload.signUpConfig;
      state.signUpConfig = {...state.signUpConfig, ...signUp};
    },
    updateMainPictuer: (state, action) => {
      const userConfig = {...state.userConfig, image: action.payload.image};
      state.userConfig = userConfig;
    },
    updateSearchMode: (state, action) => {
      state.filters.search_mode_filter = action.payload.searchMode;
    },
    updateHobbies: (state, action) => {
      state.myHobbies = action.payload.myHobbies;
    },
    updateFilters: (state, action) => {
      state.filters = {...action.payload.filters};
    },
    clearFilters: state => {
      state.filters = {...initialState.filters};
      console.log('changed');
    },
    clearHobbies: state => {
      state.myHobbies = [];
    },
    clearSignUpConfig: state => {
      state.signUpConfig = {};
    },
  },
});

export const {
  updateDetails,
  updateMainPictuer,
  updateSearchMode,
  clearSignUpConfig,
  updateConfiguration,
  updateHobbies,
  updateFilters,
  clearFilters,
  clearHobbies,
} = configurationSlice.actions;

export default configurationSlice.reducer;
