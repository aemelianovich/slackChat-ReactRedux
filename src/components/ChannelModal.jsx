// @ts-nocheck

import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal, Spinner,
} from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { actions, selectors } from '../slices';
import { modalTypes } from '../slices/modalSlice.js';
import { SocketContext } from './SocketContext.jsx';

const { addChannel, removeChannel, renameChannel } = modalTypes;

export const openModal = (type, channelId, dispatch) => () => {
  const extra = channelId ? { channelId } : null;
  dispatch(actions.openModal({
    type,
    extra,
  }));
};

const AddChannelModal = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const { isOpened, type } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const channelNames = channels.map((channel) => channel.name);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t(`channels.${type}.requiredName`))
      .min(3, t(`channels.${type}.nameLength`))
      .max(20, t(`channels.${type}.nameLength`))
      .notOneOf(channelNames, t(`channels.${type}.uniqueName`)),
  });

  const closeModal = () => {
    dispatch(actions.closeModal());
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  });

  return (
    <Modal
      show={isOpened}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{t(`channels.${type}.title`)}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: '',
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await emitMessage(emitTypes.newChannel, { name: values.name });
              closeModal();
            } catch (error) {
              if (error.isTimeoutError || error.isSocketError) {
                setErrors({
                  name: error.message,
                });
              } else {
                setErrors({
                  name: t('errors.sendError'),
                });
              }
              console.error(error);
              rollbar.error('ChannelModalWindow', error);
            }
          }}
        >
          {({
            isSubmitting, errors, touched,
          }) => (
            <Form>
              <div className="form-group">
                <Field
                  name="name"
                  autoComplete="name"
                  id="name"
                  className={`mb-2 form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  autoFocus
                  disabled={isSubmitting}
                  data-testid="add-channel"
                  innerRef={inputRef}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                <div className="d-flex justify-content-end">
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal}>
                    {t(`channels.${type}.closeBtn`)}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
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
                            className="me-1"
                          />
                        )
                        : null
                      }
                    {t(`channels.${type}.submitBtn`)}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const RenameChannelModal = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const { isOpened, type, extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const channelNames = channels.map((channel) => channel.name);
  const [currentChannel] = channels
    .filter((channel) => channel.id === extra.channelId);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t(`channels.${type}.requiredName`))
      .min(3, t(`channels.${type}.nameLength`))
      .max(20, t(`channels.${type}.nameLength`))
      .notOneOf(channelNames, t(`channels.${type}.uniqueName`)),
  });

  const closeModal = () => {
    dispatch(actions.closeModal());
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  });

  return (
    <Modal
      show={isOpened}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{t(`channels.${type}.title`)}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: currentChannel.name,
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await emitMessage(
                emitTypes.renameChannel,
                { id: currentChannel.id, name: values.name },
              );
              closeModal();
            } catch (error) {
              if (error.isTimeoutError || error.isSocketError) {
                setErrors({
                  name: error.message,
                });
              } else {
                setErrors({
                  name: t('errors.sendError'),
                });
              }
              console.error(error);
              rollbar.error('ChannelModalWindow', error);
            }
          }}
        >
          {({
            isSubmitting, errors, touched,
          }) => (
            <Form>
              <div className="form-group">
                <Field
                  name="name"
                  autoComplete="name"
                  id="name"
                  className={`mb-2 form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                  autoFocus
                  disabled={isSubmitting}
                  data-testid="rename-channel"
                  innerRef={inputRef}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                <div className="d-flex justify-content-end">
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal}>
                    {t(`channels.${type}.closeBtn`)}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
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
                            className="me-1"
                          />
                        )
                        : null
                      }
                    {t(`channels.${type}.submitBtn`)}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const { isOpened, type, extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const [currentChannel] = channels
    .filter((channel) => channel.id === extra.channelId);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  const closeModal = () => {
    dispatch(actions.closeModal());
  };

  return (
    <Modal
      show={isOpened}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{t(`channels.${type}.title`)}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: currentChannel.name,
          }}
          validationSchema={null}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async ({ setErrors }) => {
            try {
              await emitMessage(emitTypes.removeChannel, { id: currentChannel.id });
              closeModal();
            } catch (error) {
              if (error.isTimeoutError || error.isSocketError) {
                setErrors({
                  name: error.message,
                });
              } else {
                setErrors({
                  name: t('errors.sendError'),
                });
              }
              console.error(error);
              rollbar.error('ChannelModalWindow', error);
            }
          }}
        >
          {({
            isSubmitting, errors,
          }) => (
            <Form>
              <div className="form-group">
                <p
                  className="lead"
                  data-testid="remove-channel"
                >
                  {t(`channels.${type}.question`)}
                </p>
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <div className="d-flex justify-content-end">
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal}>
                    {t(`channels.${type}.closeBtn`)}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-danger"
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
                            className="me-1"
                          />
                        )
                        : null
                      }
                    {t(`channels.${type}.submitBtn`)}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const ChannelModal = () => {
  const { type } = useSelector(selectors.selectModalState);
  const rollbar = useRollbar();

  if (!type) {
    return null;
  }

  switch (type) {
    case addChannel:
      return <AddChannelModal />;
    case removeChannel:
      return <RemoveChannelModal />;
    case renameChannel:
      return <RenameChannelModal />;
    default:
      // eslint-disable-next-line no-case-declarations
      const err = new Error(`Undefined modal type: ${type}`);
      rollbar.error(err);
      throw err;
  }
};

export default ChannelModal;
