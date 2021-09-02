/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { actions as channelActions } from './channelsSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload.newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelActions.fetchInitData.fulfilled, (state, { payload }) => {
        state.messages = payload.messages;
      })
      .addCase(channelActions.removeChannel,
        (state, { payload }) => {
          _.remove(state.messages, (message) => message.channelId === payload.channelId);
        });
  },
});

// Action creators are generated for each case reducer function
export const { actions } = messagesSlice;

export default messagesSlice.reducer;
