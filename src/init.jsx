// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import { Provider } from 'react-redux';

import '../assets/application.scss';
import App from './components/App.jsx';
import store from './app/store';
import { SocketContext } from './components/SocketContext.jsx';
import { actions } from './app/slices/index';
import TimeoutError from './errors/TimeoutError';
import SocketConnectionError from './errors/SocketConnectionError';
import './i18n';

const socketTimeout = 9000000000000;
const emitTypes = {
  newMessage: 'newMessage',
  newChannel: 'newChannel',
  renameChannel: 'renameChannel',
  removeChannel: 'removeChannel',
};

export default (socket) => {
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
            resolve();
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
    store.dispatch(actions.closeModal());
    store.dispatch(actions.addChannel({ newChannel }));
    store.dispatch(actions.setCurrentChannelId({ id: newChannel.id }));
  });

  socket.on(emitTypes.renameChannel, (channel) => {
    store.dispatch(actions.closeModal());
    store.dispatch(actions.renameChannel({ channel }));
  });

  socket.on(emitTypes.removeChannel, (data) => {
    store.dispatch(actions.closeModal());
    store.dispatch(actions.removeChannel({ channelId: data.id }));
  });

  return (
    <SocketContext.Provider value={{ emitMessage, emitTypes }}>
      <Provider store={store}>
        <App />
      </Provider>
    </SocketContext.Provider>
  );
};
