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
import { SocketContext } from './components/SocketContext.jsx';
import { reducer, actions } from './slices/index';
import TimeoutError from './errors/TimeoutError';
import SocketConnectionError from './errors/SocketConnectionError';
import resources from './locales';

export default (socket) => {
  const rollbarConfig = {
    accessToken: '0ed50afbd64e4730b25360b9eedaf090',
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

  const socketTimeout = 3000;

  const emitTypes = {
    newMessage: 'newMessage',
    newChannel: 'newChannel',
    renameChannel: 'renameChannel',
    removeChannel: 'removeChannel',
  };

  const emitMessage = (emitType, data, timeout = socketTimeout) => (
    new Promise((resolve, reject) => {
      if (!socket) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(new SocketConnectionError());
      } else {
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
      }
    })
  );

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
        <SocketContext.Provider value={{ emitMessage, emitTypes }}>
          <Provider store={store}>
            <App />
          </Provider>
        </SocketContext.Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
