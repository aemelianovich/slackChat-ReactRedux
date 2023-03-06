// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import '../assets/application.scss';
import App from './components/App.jsx';
import { SocketContext } from './contexts/SocketContext.jsx';
import { reducer, actions } from './slices/index';
import resources from './locales';
import TimeoutError from './errors/TimeoutError';
import { emitTypes, socketTimeout } from './constants';

export default async (socket) => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      debug: !(process.env.NODE_ENV === 'production'),
      resources,
    });

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_TOKEN,
    environment: process.env.NODE_ENV || 'development',
  };

  const store = configureStore({
    reducer,
  });

  const emitMessage = (emitType, data, timeout) => (
    new Promise((resolve, reject) => {
      // eslint-disable-next-line functional/no-let
      let called = false;
      const timer = setTimeout(() => {
        if (called) return;
        called = true;
        reject(new TimeoutError());
      }, timeout);
      socket.volatile.emit(emitType, data, (response) => {
        if (called) return;
        called = true;
        clearTimeout(timer);
        if (response.status === 'ok') {
          resolve(response);
        } else {
          console.error(response);
          reject(response);
        }
      });
    })
  );

  const emitApi = {
    newMessage: (data) => emitMessage(emitTypes.newMessage, data, socketTimeout),
    newChannel: (data) => emitMessage(emitTypes.newChannel, data, socketTimeout),
    renameChannel: (data) => emitMessage(emitTypes.renameChannel, data, socketTimeout),
    removeChannel: (data) => emitMessage(emitTypes.removeChannel, data, socketTimeout),
  };

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
        <SocketContext.Provider value={{ emitApi }}>
          <Provider store={store}>
            <App />
          </Provider>
        </SocketContext.Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
