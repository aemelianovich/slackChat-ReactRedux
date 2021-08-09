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
import './i18n';

export default (socket) => {
  const sendMessage = (message) => (
    new Promise((resolve, reject) => {
      if (!socket) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('No socket connection.');
      } else {
        socket.emit('newMessage', message, (response) => {
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

  socket.on('newMessage', (newMessage) => {
    store.dispatch(actions.addMessage({ newMessage }));
  });

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      <Provider store={store}>
        <App />
      </Provider>
    </SocketContext.Provider>
  );
};
