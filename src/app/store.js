import { configureStore } from '@reduxjs/toolkit';
import { channelsReducer, messagesReducer, modalReducer } from './slices';

const store = configureStore({
  reducer: {
    channelsInfo: channelsReducer,
    messagesInfo: messagesReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
