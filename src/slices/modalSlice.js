/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  type: null,
  extra: null,
};

export const modalTypes = {
  addChannel: 'addChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      state.isOpened = true;
      state.type = payload.type;
      state.extra = payload.extra;
    },
    closeModal: (state) => {
      state.isOpened = false;
      state.type = null;
      state.extra = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions } = modalSlice;

export default modalSlice.reducer;
