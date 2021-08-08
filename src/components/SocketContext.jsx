// @ts-check
import io from 'socket.io-client';
import React, {
  createContext, useEffect, useState, useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import routes from '../routes';
import { useUserContext } from './UserContext.jsx';
import { actions } from '../app/slices';

const SocketContext = createContext(null);
export const useSocketContext = () => useContext(SocketContext);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const { user } = useUserContext();
  const dispatch = useDispatch();

  // @ts-ignore
  useEffect(() => {
    if (!user) {
      return () => (null);
    }

    const newSocket = io(routes.host);
    // @ts-ignore
    setSocket(newSocket);

    return () => newSocket.close();
  }, [user, routes.host]);

  const sendMessage = (message) => {
    // @ts-ignore
    socket.emit('newMessage', message);
  };

  useEffect(() => {
    if (socket) {
      // @ts-ignore
      socket.on('newMessage', (newMessage) => {
        dispatch(actions.addMessage({ newMessage }));
      });
    }
  });

  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      { children }
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
