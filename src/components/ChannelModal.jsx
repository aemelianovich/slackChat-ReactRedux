// @ts-nocheck

import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { actions, selectors } from '../slices';
import { modalTypes } from '../slices/modalSlice.js';
import { SocketContext } from './SocketContext.jsx';

const { addChannel, removeChannel, renameChannel } = modalTypes;

const getValidationSchema = (type, channelNames, t) => Yup.object().shape({
  name: Yup.string()
    .required(t(`channels.${type}.requiredName`))
    .min(3, t(`channels.${type}.nameLength`))
    .max(20, t(`channels.${type}.nameLength`))
    .notOneOf(channelNames, t(`channels.${type}.uniqueName`)),
});

export const openModal = (type, channelId, dispatch) => () => {
  const extra = channelId ? { channelId } : null;
  dispatch(actions.openModal({
    type,
    extra,
  }));
};

const closeModal = (dispatch) => () => {
  dispatch(actions.closeModal());
};

const AddChannelModal = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { type } = useSelector(selectors.selectModalState);
  const channelNames = useSelector(selectors.selectChannelNames);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  });

  return (
    <>
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
          validationSchema={getValidationSchema(type, channelNames, t)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              const response = await emitMessage(emitTypes.newChannel, { name: values.name });
              dispatch(actions.setCurrentChannelId({ id: response.data.id }));
              closeModal(dispatch)();
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
              throw error;
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
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal(dispatch)}>
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
    </>
  );
};

const RenameChannelModal = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { type, extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const channelNames = useSelector(selectors.selectChannelNames);
  const currentChannel = channels.find((channel) => channel.id === extra.channelId);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  });

  return (
    <>
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
          validationSchema={getValidationSchema(type, channelNames, t)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await emitMessage(
                emitTypes.renameChannel,
                { id: currentChannel.id, name: values.name },
              );
              closeModal(dispatch)();
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
              throw error;
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
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal(dispatch)}>
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
    </>
  );
};

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { type, extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const currentChannel = channels.find((channel) => channel.id === extra.channelId);

  const { emitMessage, emitTypes } = useContext(SocketContext);

  return (
    <>
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
              closeModal(dispatch)();
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
              throw error;
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
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal(dispatch)}>
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
    </>
  );
};

const ChannelModal = () => {
  const { isOpened, type } = useSelector(selectors.selectModalState);
  const dispatch = useDispatch();

  if (!type) {
    return null;
  }

  // eslint-disable-next-line functional/no-let
  let modalDetails;
  switch (type) {
    case addChannel:
      modalDetails = <AddChannelModal />;
      break;
    case removeChannel:
      modalDetails = <RemoveChannelModal />;
      break;
    case renameChannel:
      modalDetails = <RenameChannelModal />;
      break;
    default:
      throw new Error(`Undefined modal type: ${type}`);
  }

  return (
    <Modal
      show={isOpened}
      onHide={closeModal(dispatch)}
      centered
    >
      {modalDetails}
    </Modal>
  );
};

export default ChannelModal;
