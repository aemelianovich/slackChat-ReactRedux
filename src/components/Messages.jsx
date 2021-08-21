import React, { useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Card, Toast, Button, InputGroup, Spinner,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { selectCurrentChannelInfo, selectCurrentChannelId } from '../app/slices/channelsSlice';
import { selectChannelMessages } from '../app/slices/messagesSlice';
import { useUserContext } from './UserContext.jsx';
import { SocketContext } from './SocketContext.jsx';

const ChannelInfo = () => {
  const { name } = useSelector(selectCurrentChannelInfo);
  const messages = useSelector(selectChannelMessages);
  const { t } = useTranslation();
  return (
    <Card border="light" className="bg-light mb-4 p-3 shadow-sm small">
      <Card.Title as="p" className="mb-0">
        <b>{`# ${name}`}</b>
      </Card.Title>
      <Card.Text as="span" className="text-muted">
        {t('messages.messageCount')(messages.length)}
      </Card.Text>
    </Card>
  );
};

const Message = ({ message, username }) => (
  <Toast
    bg={(username === message.username) ? 'info' : 'light'}
    className="mt-2"
  >
    <Toast.Header closeButton={false}>
      <strong className="me-auto">{message.username}</strong>
    </Toast.Header>
    <Toast.Body>{message.body}</Toast.Body>
  </Toast>
);

const NewMessage = () => {
  const { user } = useUserContext();
  const channelId = useSelector(selectCurrentChannelId);
  const inputRef = useRef(null);
  const { emitMessage, emitTypes } = useContext(SocketContext);
  const { t } = useTranslation();
  const rollbar = useRollbar();

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={{
          message: '',
        }}
        onSubmit={async (values, { resetForm, setErrors }) => {
          try {
            const newMessage = {
              body: values.message,
              channelId,
              username: user.username,
            };
            await emitMessage(emitTypes.newMessage, newMessage);
            resetForm();
          } catch (error) {
            if (error.isTimeoutError || error.isSocketError) {
              setErrors({
                message: error.message,
              });
            } else {
              setErrors({
                message: t('errors.sendError'),
              });
            }
            rollbar.error('NewMessage', error);
            console.error(error);
          }
        }}
      >
        {({
          isSubmitting, values, errors, touched,
        }) => (
          <Form className="py-1 border rounded-2" noValidate>
            <InputGroup className="has-validation pl-2 pr-0">
              <Field
                name="message"
                autoComplete="message"
                data-testid="new-message"
                placeholder={t('messages.newMessage')}
                id="new-message"
                className={`border-0 p-0 ps-2 form-control${errors.message && touched.message ? ' is-invalid' : ''}`}
                disabled={isSubmitting}
                innerRef={inputRef}
              />
              <ErrorMessage name="message" component="div" className="invalid-feedback" />
              <Button
                type="submit"
                variant="group-vertical"
                disabled={isSubmitting || (values.message.length === 0)}
              >
                {
                  isSubmitting
                    ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )
                    : <Icon.ArrowRightSquare width="20" height="20" />
              }
                <span className="visually-hidden">{t('messages.sendMessageBtn')}</span>
              </Button>
            </InputGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Messages = () => {
  const { user } = useUserContext();
  const messages = useSelector(selectChannelMessages);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <ChannelInfo />
        {(messages.length === 0)
          ? null
          : (
            <div
              id="messages-box"
              className="chat-messages overflow-auto px-5"
            >
              {messages.map((message) => (
                <Message
                  message={message}
                  username={user.username}
                  key={message.id}
                />
              ))}
              <div ref={scrollRef} />
            </div>
          )}
        <NewMessage />
      </div>
    </div>
  );
};

export default Messages;
