// @ts-check

import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetChatDataQuery } from '../app/services/chatApi.js';
import { UserContext } from './UserContext.jsx';
import { actions } from '../app/slices';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const { data } = useGetChatDataQuery(user);

  useEffect(() => {
    if (data) {
      dispatch(actions.initChatData(data));
    }
  }, [data, dispatch]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
};
export default Chat;
