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
    openModal: (state, action) => {
      if (!modalTypes[action.payload.type]) {
        throw new Error(`Unsupported modal type: ${action.payload.type}`);
      }
      // throw new Error(`Unsupported modal type: ${action.payload.type}`);
      state.isOpened = true;
      state.type = action.payload.type;
      state.extra = action.payload.extra;
    },
    closeModal: (state) => {
      state.isOpened = false;
      state.type = null;
      state.extra = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const modalActions = modalSlice.actions;

export default modalSlice.reducer;
