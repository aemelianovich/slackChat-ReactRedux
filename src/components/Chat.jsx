// @ts-check

import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetChatDataQuery } from '../app/services/chatApi.js';
import { useUserContext } from './UserContext.jsx';
import { actions } from '../app/slices';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const { user } = useUserContext();
  const dispatch = useDispatch();
  const { data } = useGetChatDataQuery(user);

  useEffect(() => {
    if (data) {
      dispatch(actions.initChatData(data));
    }
  }, [data, dispatch]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </Container>
  );
};
export default Chat;
