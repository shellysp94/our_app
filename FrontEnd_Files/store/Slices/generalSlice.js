/* eslint-disable no-unused-vars */
/* eslint-disable no-sequences */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import Promise from 'promise';
import {useDispatch} from 'react-redux';

const initialState = {
  rawText: {},
  status: 'disconnected',
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
      console.log('status changed');
    },
    getConstants: (state, action) => {
      console.log('GETTING CONSTENTS...');
    },
  },
});

export const {rawText, changeStatus, getConstants} = generalSlice.actions;

export default generalSlice.reducer;
