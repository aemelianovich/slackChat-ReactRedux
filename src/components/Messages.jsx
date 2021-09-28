import React, { useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Card, Button, InputGroup, Spinner, Form,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { animateScroll as scroll } from 'react-scroll';
import { selectors } from '../slices';
import { UserContext } from '../contexts/UserContext.jsx';
import { SocketContext } from '../contexts/SocketContext.jsx';

const ChannelInfo = () => {
  const channel = useSelector(selectors.selectCurrentChannel);
  const messages = useSelector(selectors.selectChannelMessages);
  const { t } = useTranslation();
  return (
    <Card border="light" className="bg-light mb-4 p-3 shadow-sm small">
      <Card.Title as="p" className="mb-0">
        <b>{`# ${channel?.name}`}</b>
      </Card.Title>
      <Card.Text as="span" className="text-muted">
        {t('messages.messageCount', { count: messages.length })}
      </Card.Text>
    </Card>
  );
};

const Message = ({ message }) => (
  <div className="text-break mb-2">
    <b>{message.username}</b>
    {`: ${message.body}`}
  </div>
);

const NewMessage = () => {
  const { user } = useContext(UserContext);
  const channel = useSelector(selectors.selectCurrentChannel);
  const inputRef = useRef(null);
  const { emitApi } = useContext(SocketContext);
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
              channelId: channel?.id,
              username: user.username,
            };
            await emitApi.newMessage(newMessage);
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
            throw error;
          }
        }}
      >
        {({
          isSubmitting, errors, touched, handleChange, values, handleSubmit, handleBlur,
        }) => (
          <Form className="py-1 border rounded-2" noValidate onSubmit={handleSubmit}>
            <InputGroup className="pl-2 pr-0" hasValidation>
              <Form.Control
                name="message"
                autoComplete="message"
                data-testid="new-message"
                placeholder={t('messages.newMessage')}
                id="new-message"
                className="border-0 p-0 ps-2"
                isInvalid={!!touched.message && !!errors.message}
                disabled={isSubmitting}
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={inputRef}
              />
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
              <Form.Control.Feedback type="invalid">
                {errors.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Messages = () => {
  const messages = useSelector(selectors.selectChannelMessages);

  useEffect(() => {
    scroll.scrollToBottom({ containerId: 'messages-box', smooth: false });
  }, [messages]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <ChannelInfo />
        <div
          id="messages-box"
          className="chat-messages overflow-auto px-5"
        >
          {messages.map((message) => (
            <Message
              message={message}
              key={message.id}
            />
          ))}
        </div>
        <NewMessage />
      </div>
    </div>
  );
};

export default Messages;
