import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userConfig: {},
  signUpConfig: {
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    city: '',
    phone_number: '',
    profession: '',
  },
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
    friends_only_filter: false,
    online_filter: false,
    radius_filter: 500,
  },
};

export const configurationSlice = createSlice({
  name: 'configer',
  initialState,
  reducers: {
    updateUserId: (state, action) => {
      state.userConfig.user_id = {
        ...state.userConfig,
        user_id: action.payload.user_id,
      };
    },
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
    updateOneFilter: (state, action) => {
      const filter = action.payload.filter;
      const item = action.payload.item;
      state.filters[filter] = item;
    },
    updateOneSignUpConfig: (state, action) => {
      const key = action.payload.key;
      const value = action.payload.value;
      state.signUpConfig[key] = value;
    },

    clearFilters: state => {
      state.filters = {...initialState.filters};
    },
    clearHobbies: state => {
      state.myHobbies = [];
    },
    clearSignUpConfig: state => {
      state.signUpConfig = {};
    },
    clearConfigurationSlice: state => initialState,
  },
});

export const {
  updateUserId,
  updateDetails,
  updateOneFilter,
  updateMainPictuer,
  updateSearchMode,
  updateConfiguration,
  updateHobbies,
  updateFilters,
  updateOneSignUpConfig,
  clearSignUpConfig,
  clearFilters,
  clearHobbies,
  clearConfigurationSlice,
} = configurationSlice.actions;

export default configurationSlice.reducer;
