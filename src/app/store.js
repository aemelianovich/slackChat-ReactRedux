import { configureStore } from '@reduxjs/toolkit';
import { chatApi } from './services/chatApi.js';
import { channelsReducer, messagesReducer, modalReducer } from './slices';

const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    channelsInfo: channelsReducer,
    messagesInfo: messagesReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatApi.middleware),
});

export default store;
