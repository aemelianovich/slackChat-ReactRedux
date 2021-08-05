// @ts-check

import React, { useContext } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card, Toast, Container, Button,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Formik, Form, Field } from 'formik';
import { selectCurrentChannelInfo } from '../app/slices/channelsSlice';
import { selectChannelMessages } from '../app/slices/messagesSlice';
import { UserContext } from './UserContext.jsx';

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

const renderMessages = (messages, username) => (
  <Container id="messages-box" className="chat-messages overflow-auto px-5">
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
  </Container>
);

const renderInputWindow = () => (
  <Container className="mt-auto px-5 py-3">
    <Formik
      initialValues={{
        message: '',
      }}
      onSubmit={async (values) => {
        try {
          await new Promise((r) => setTimeout(r, 1));
          alert(JSON.stringify(values, null, 2));
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form className="py-1 border rounded-2" noValidate>
          <Container className="input-group has-validation pl-2 pr-0">
            <Field
              name="message"
              autoComplete="message"
              data-testid="new-message"
              placeholder="Введите сообщеине..."
              id="new-message"
              className="border-0 p-0 ps-2 form-control"
            />
            <Button
              type="submit"
              variant="group-vertical"
              disabled={isSubmitting || (values.message.length === 0)}
            >
              <Icon.ArrowRightSquare width="20" height="20" />
            </Button>
          </Container>
        </Form>
      )}
    </Formik>
  </Container>
);

const Messages = () => {
  const channel = useSelector(selectCurrentChannelInfo, shallowEqual);
  const messages = useSelector(selectChannelMessages, shallowEqual);
  const { user } = useContext(UserContext);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        {renderChannelInfo(channel.name, messages.length)}
        {renderMessages(messages, user.username)}
        {renderInputWindow()}
      </div>
    </div>
  );
};
export default Messages;
