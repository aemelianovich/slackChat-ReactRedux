/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { channelActions } from './channelsSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload.newMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelActions.fetchInitData.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(channelActions.removeChannel,
        (state, action) => {
          _.remove(state.messages, (message) => message.channelId === action.payload.channelId);
        });
  },
});

// Action creators are generated for each case reducer function
export const messageActions = messagesSlice.actions;

export default messagesSlice.reducer;
