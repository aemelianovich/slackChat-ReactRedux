/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { initChatData } from './channelsSlice.js';

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messagesInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initChatData, (state, action) => {
        state.messages = action.payload.messages;
      });
  },
});

export const selectChannelMessages = (state) => {
  if (!state.channelsInfo.currentChannelId) {
    return [];
  }

  if (!state.messagesInfo.messages.length === 0) {
    return [];
  }

  const messages = state.messagesInfo.messages.filter(
    (message) => (message.channelId === state.channelsInfo.currentChannelId),
  );

  return messages;
};

export default messagesSlice.reducer;
