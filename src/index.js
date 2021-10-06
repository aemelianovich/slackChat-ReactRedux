// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import '../assets/application.scss';
import init from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const app = async () => {
  const socket = io();
  const vdom = await init(socket);
  ReactDOM.render(
    vdom,
    document.querySelector('#chat'),
  );
};

app();
