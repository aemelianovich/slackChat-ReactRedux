// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import '../assets/application.scss';
import init from './init.jsx';
import routes from './routes';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const socket = io(routes.host);

ReactDOM.render(
  init(socket),
  document.querySelector('#chat'),
);
