// @ts-check

import React, { useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card, Toast, Container, Button, InputGroup,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Formik, Form, Field } from 'formik';
import { selectCurrentChannelInfo } from '../app/slices/channelsSlice';
import { selectChannelMessages } from '../app/slices/messagesSlice';
import { useUserContext } from './UserContext.jsx';
import { useSocketContext } from './SocketContext.jsx';

const renderChannelInfo = (name, messageCount) => (
  <Card border="light" className="bg-light mb-2 p-0 shadow-sm small">
    <Card.Body>
      <Card.Title as="p" className="mb-0 font-weight-bold">{`# ${name}`}</Card.Title>
      <Card.Text as="span" className="text-muted">
        {`${messageCount} сообщения`}
      </Card.Text>
    </Card.Body>
  </Card>
);

const renderMessages = (messages, username, scrollRef) => (
  <Container
    id="messages-box"
    className="chat-messages overflow-auto px-5"
  >
    {messages.map((message) => (
      <Toast
        key={message.id}
        className={(username === message.username) ? 'bg-info' : 'bg-light'}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">{message.username}</strong>
        </Toast.Header>
        <Toast.Body>{message.body}</Toast.Body>
      </Toast>
    ))}
    <div ref={scrollRef} />
  </Container>
);

const renderInputWindow = (sendMessage, username, channelId, inputRef) => (
  <Container className="mt-auto px-5 py-3">
    <Formik
      initialValues={{
        message: '',
      }}
      onSubmit={(values, { resetForm }) => {
        try {
          const newMessage = {
            body: values.message,
            channelId,
            username,
          };
          sendMessage(newMessage);
          resetForm();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="py-1 border rounded-2" noValidate>
          <InputGroup className="has-validation pl-2 pr-0">
            <Field
              name="message"
              autoComplete="message"
              data-testid="new-message"
              placeholder="Введите сообщеине..."
              id="new-message"
              className="border-0 p-0 ps-2 form-control"
              innerRef={inputRef}
            />
            <InputGroup.Append>
              <Button
                type="submit"
                variant="group-vertical"
                disabled={isSubmitting || (values.message.length === 0)}
              >
                <Icon.ArrowRightSquare width="20" height="20" />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      )}
    </Formik>
  </Container>
);

const Messages = () => {
  const channel = useSelector(selectCurrentChannelInfo, shallowEqual);
  const messages = useSelector(selectChannelMessages, shallowEqual);
  const { user } = useUserContext();
  const { sendMessage } = useSocketContext();
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        {renderChannelInfo(channel.name, messages.length)}
        {renderMessages(messages, user.username, scrollRef)}
        {renderInputWindow(sendMessage, user.username, channel.id, inputRef)}
      </div>
    </div>
  );
};
export default Messages;
