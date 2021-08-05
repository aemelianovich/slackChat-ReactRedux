/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};

export const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    initChatData: (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initChatData, setCurrentChannelId } = channelsSlice.actions;

export const selectChannels = (state) => state.channelsInfo.channels;
export const selectCurrentChannelId = (state) => state.channelsInfo.currentChannelId;
export const selectCurrentChannelInfo = (state) => {
  if (state.channelsInfo.channels.length === 0) {
    return {};
  }

  const [currentChannel] = state.channelsInfo.channels.filter(
    (channel) => (channel.id === state.channelsInfo.currentChannelId),
  );

  return currentChannel;
};

export default channelsSlice.reducer;
