import {configureStore} from '@reduxjs/toolkit';
import configurationSlice from './Slices/configurationSlice';
import chatSlice from './Slices/chatSlice';
import generalSlice from './Slices/generalSlice';
import peopleSlice from './Slices/peopleSlice';

export const store = configureStore({
  reducer: {
    general: generalSlice,
    people: peopleSlice,
    chat: chatSlice,
    configuration: configurationSlice,
  },
});

export default store;
