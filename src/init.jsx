// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import '../assets/application.scss';
import App from './components/App.jsx';
import { SocketContext } from './contexts/SocketContext.jsx';
import { reducer, actions } from './slices/index';
import resources from './locales';
import configureEmitMessage, { emitTypes } from './socket';

export default (socket) => {
  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_TOKEN,
    environment: process.env.NODE_ENV || 'development',
  };

  i18n
    .use(initReactI18next)
    .init({
      lng: 'ru',
      debug: !(process.env.NODE_ENV === 'production'),
      resources,
    });

  const store = configureStore({
    reducer,
  });

  const emitMessage = configureEmitMessage(socket);

  socket.on(emitTypes.newMessage, (newMessage) => {
    store.dispatch(actions.addMessage({ newMessage }));
  });

  socket.on(emitTypes.newChannel, (newChannel) => {
    store.dispatch(actions.addChannel({ newChannel }));
  });

  socket.on(emitTypes.renameChannel, (channel) => {
    store.dispatch(actions.renameChannel({ channel }));
  });

  socket.on(emitTypes.removeChannel, (data) => {
    store.dispatch(actions.removeChannel({ channelId: data.id }));
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <SocketContext.Provider value={{ emitMessage }}>
          <Provider store={store}>
            <App />
          </Provider>
        </SocketContext.Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
