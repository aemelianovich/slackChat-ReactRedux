/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import routes from '../routes.js';

const generalChannelIndex = 0;

const initialState = {
  channels: [],
  currentChannelId: null,
};

const fetchInitData = createAsyncThunk('channelsInfo/fetchInitData', async (user) => {
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
      _.remove(state.channels, (channel) => channel.id === action.payload.channelId);
      if (state.currentChannelId === action.payload.channelId) {
        state.currentChannelId = state.channels[generalChannelIndex].id;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitData.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
    });
  },
});

// Action creators are generated for each case reducer function
export const channelActions = { fetchInitData, ...channelsSlice.actions };

export default channelsSlice.reducer;
