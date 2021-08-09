// @ts-check

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
import { selectCurrentChannelInfo } from '../app/slices/channelsSlice';
import { selectChannelMessages } from '../app/slices/messagesSlice';
import { useUserContext } from './UserContext.jsx';
import { SocketContext } from './SocketContext.jsx';

const ChannelInfo = ({ name, messageCount }) => {
  const { t } = useTranslation();
  return (
    <Card border="light" className="bg-light mb-2 p-0 shadow-sm small">
      <Card.Body>
        <Card.Title as="p" className="mb-0 font-weight-bold">{`# ${name}`}</Card.Title>
        <Card.Text as="span" className="text-muted">
          {
          // @ts-ignore
          t('messages.messageCount')(messageCount)
          }
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const Message = ({ message, username }) => (
  <Toast
    className={(username === message.username) ? 'bg-info' : 'bg-light'}
  >
    <Toast.Header closeButton={false}>
      <strong className="me-auto">{message.username}</strong>
    </Toast.Header>
    <Toast.Body>{message.body}</Toast.Body>
  </Toast>
);

const NewMessage = ({ username, channelId }) => {
  const inputRef = useRef(null);
  const { sendMessage } = useContext(SocketContext);
  const { t } = useTranslation();

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
              username,
            };
            await sendMessage(newMessage);
            resetForm();
          } catch (error) {
            setErrors({
              message: t('errors.sendError'),
            });
            console.log(error);
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
              <InputGroup.Append>
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
                </Button>
              </InputGroup.Append>
              <ErrorMessage name="message" component="div" className="invalid-feedback" />
            </InputGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Messages = () => {
  const channel = useSelector(selectCurrentChannelInfo);
  const messages = useSelector(selectChannelMessages);
  const { user } = useUserContext();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <ChannelInfo name={channel.name} messageCount={messages.length} />
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
        <NewMessage username={user.username} channelId={channel.id} />
      </div>
    </div>
  );
};

export default Messages;
