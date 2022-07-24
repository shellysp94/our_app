/* eslint-disable no-sequences */
/* eslint-disable no-undef */
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

const onLoadingPage = async () => {
  const dispatch = useDispatch();
  console.log('Loading...');
  try {
    const response = await axios.get(
      `http://192.168.1.141:3000/dataFromSetsToClient`,
    );
    dispatch(rawText({rawText: response.data})); //BUG
  } catch (error) {
    alert(error);
  }
};

export const getUpdater = createAsyncThunk('general', async () => {
  await new Promise(resolve => (onLoadingPage(), setTimeout(resolve, 1000)));
  console.log('****');

  return 'simulatedAsyncAwait';
});
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
  },
  extraReducers: builder => {
    builder.addCase(getUpdater.pending, state => {
      state.status = 'loading';
      // console.log('state.status: ', state.status);
    });
    builder.addCase(getUpdater.fulfilled, (state, action) => {
      state.rawText = action.payload.rawText;
      state.status = 'updated';
      console.log('state.status: ', state.status);
    });
    builder.addCase(getUpdater.rejected, state => {
      state.status = 'rejected';
      // console.log('state.status: ', state.status);
    });
  },
});

export const {rawText, changeStatus} = generalSlice.actions;

export default generalSlice.reducer;
