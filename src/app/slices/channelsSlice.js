/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes.js';

const initialState = {
  channels: [],
  currentChannelId: null,
};

export const fetchChatData = createAsyncThunk('channelsInfo/fetchChatData', async (user) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${user.token}`);
  const response = await axios.get(routes.chatDataPath(), { headers: { Authorization: `Bearer ${user.token}` } });
  return response.data;
});

export const channelsSlice = createSlice({
  name: 'channelsInfo',
  initialState,
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload.id;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload.newChannel);
    },
    renameChannel: (state, action) => {
      const index = state.channels.findIndex((channel) => channel.id === action.payload.channel.id);
      if (index) {
        state.channels[index] = action.payload.channel;
      }
    },
    removeChannel:
    (state, action) => {
      const newChannels = state.channels
        .filter((channel) => channel.id !== action.payload.channelId);

      state.channels = newChannels;
      state.currentChannelId = state.channels[0].id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatData.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  initChatData, setCurrentChannelId, addChannel, renameChannel, removeChannel,
} = channelsSlice.actions;

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
