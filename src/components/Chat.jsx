// @ts-nocheck

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUserContext } from './UserContext.jsx';
import { actions } from '../app/slices';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const { user } = useUserContext();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchChatData(user));
  }, [user]);

  return (
    <div className="h-100 my-4 overflow-hidden rounded shadow container">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
};

export default Chat;
