/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import routes from '../routes.js';

const defaultChannelId = 0;

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
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload.id;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload.newChannel);
    },
    renameChannel: (state, { payload }) => {
      const index = state.channels.findIndex((channel) => channel.id === payload.channel.id);
      if (index) {
        state.channels[index] = payload.channel;
      }
    },
    removeChannel:
    (state, { payload }) => {
      _.remove(state.channels, (channel) => channel.id === payload.channelId);
      if (state.currentChannelId === payload.channelId) {
        state.currentChannelId = state.channels[defaultChannelId].id;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitData.fulfilled, (state, { payload }) => {
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    });
  },
});

// Action creators are generated for each case reducer function
export const actions = { fetchInitData, ...channelsSlice.actions };

export default channelsSlice.reducer;
