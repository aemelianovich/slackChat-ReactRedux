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
  }, [user, dispatch]);

  return (
    <div className="h-100 my-4 overflow-hidden rounded shadow container">
      <div className="row h-100 bg-white flex-md-row">
        <div className="h-100 col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <Messages />
        </div>
      </div>
    </div>
  );
};

export default Chat;
