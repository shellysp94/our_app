import {createStore} from 'redux';
//import {configureStore} from '@reduxjs/toolkit';
let state = {
  userConfig: {},
  email: '',
  fullName: '',
  token: '',
  rawText: {},
  searchMode: 'Whatever',
  filters: {
    search_mode_filter: 'Whatever',
    hobbies_filter: 'Hobbies',
    gender_filter: 'Gender',
    relationship_filter: 'Relationship',
    interested_in_filter: 'Interested in',
    age_filter: [],
    friends_only_filter: 0,
  },
  nearbyPeople: [],
  myFriends: [],
  friendToSearch: '',
  myHobbies: [],
  OpenChats: [],
  currChat: [],
};

const Reducer = (state, action) => {
  if (action.type === 'UPDATE_DEATAILS') {
    return {
      ...state,
      userConfig: action.userConfig,
      email: action.email,
      fullName: action.fullName,
      token: action.token,
    };
  }
  if (action.type === 'UPDATE_MAIN_PICTURE') {
    const userConfig = {...state.userConfig, image: action.image};
    return {...state, userConfig};
  }
  if (action.type === 'UPDATE_SEARCH_MODE') {
    return {...state, searchMode: action.searchMode};
  }
  if (action.type === 'GET_RAW_TEXT') {
    return {
      ...state,
      rawText: action.rawText,
    };
  }
  if (action.type === 'UPDATE_FILTERS') {
    return {
      ...state,
      filters: action.filters,
    };
  }
  if (action.type === 'UPDATE_NEARBY_PEOPLE') {
    return {
      ...state,
      nearbyPeople: action.nearbyPeople,
    };
  }
  if (action.type === 'UPDATE_MY_FRIENDS') {
    return {
      ...state,
      myFriends: action.myFriends,
    };
  }
  if (action.type === 'FRIEND_TO_SEARCH') {
    return {
      ...state,
      friendToSearch: action.friendToSearch,
    };
  }

  if (action.type === 'UPDATE_MY_HOBBIES') {
    return {
      ...state,
      myHobbies: action.myHobbies,
    };
  }
  if (action.type === 'ALL_CHATS') {
    return {
      ...state,
      OpenChats: action.OpenChats,
    };
  }
  if (action.type === 'SET_CURR_CHAT') {
    return {
      ...state,
      currChat: action.currChat,
    };
  }

  return state;
};

const store = createStore(Reducer, state);
export default store;
