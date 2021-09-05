// @ts-nocheck

import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { UserContext } from '../contexts/UserContext.jsx';
import { actions } from '../slices';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchInitData(user));
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
