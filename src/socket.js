import TimeoutError from './errors/TimeoutError';

const socketTimeout = 3000;

export const emitTypes = {
  newMessage: 'newMessage',
  newChannel: 'newChannel',
  renameChannel: 'renameChannel',
  removeChannel: 'removeChannel',
};

export default (socket) => (emitType, data, timeout = socketTimeout) => (
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
