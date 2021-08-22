// @ts-nocheck

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useGetChatDataQuery } from '../app/services/chatApi.js';
import { useUserContext } from './UserContext.jsx';
import { actions } from '../app/slices';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const Chat = () => {
  const { user } = useUserContext();
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetChatDataQuery(user);
  const { t } = useTranslation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(actions.initChatData(data));
    }
  }, [data, dispatch]);

  const render = () => {
    if (isSuccess) {
      return (
        <>
          <Channels />
          <Messages />
        </>
      );
    } if (isError) {
      return (<div className="col text-danger align-self-center" align="center">{t('errors.generic')}</div>);
    }

    return (null
      /* 
      <div className="col align-self-center" align="center">
        <Spinner
          as="span"
          animation="border"
          size="md"
          role="status"
          aria-hidden="true"
        />
      </div>
      */
    );
  };

  return (
    <div className="h-100 my-4 overflow-hidden rounded shadow container">
      <div className="row h-100 bg-white flex-md-row">
        {render()}
      </div>
    </div>
  );
};

export default Chat;
