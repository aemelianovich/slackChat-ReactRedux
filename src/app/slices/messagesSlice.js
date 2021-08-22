/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { fetchChatData, removeChannel } from './channelsSlice.js';

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
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(removeChannel,
        (state, action) => (
          {
            messages: state.messages
              .filter((message) => message.channelId !== action.payload.channelId),
          }
        ));
  },
});

// Action creators are generated for each case reducer function
export const { addMessage } = messagesSlice.actions;

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
