// @ts-nocheck

import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal, Spinner, Form, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import { actions, selectors } from '../slices';
import { modalTypes } from '../slices/modalSlice.js';
import { SocketContext } from '../contexts/SocketContext.jsx';

const getValidationSchema = (channelNames, t) => Yup.object().shape({
  name: Yup.string()
    .required(t('modals.requiredName'))
    .min(3, t('modals.nameLength'))
    .max(20, t('modals.nameLength'))
    .notOneOf(channelNames, t('modals.uniqueName')),
});

const AddChannelModal = ({ closeModal }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channelNames = useSelector(selectors.selectChannelNames);

  const { emitApi } = useContext(SocketContext);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    });
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{t('modals.addChannelTitle')}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={getValidationSchema(channelNames, t)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              const response = await emitApi.newChannel({ name: values.name });
              dispatch(actions.setCurrentChannelId({ id: response.data.id }));
              closeModal();
            } catch (error) {
              setErrors({
                name: t('errors.sendError'),
              });
              throw error;
            }
          }}
        >
          {({
            isSubmitting, errors, touched, handleChange, values, handleSubmit, handleBlur,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  name="name"
                  autoComplete="name"
                  id="name"
                  className="mb-2"
                  isInvalid={!!touched.name && !!errors.name}
                  autoFocus
                  disabled={isSubmitting}
                  data-testid="add-channel"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={inputRef}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
                <div className="d-flex justify-content-end">
                  <Button type="button" variant="secondary" className="me-2" onClick={closeModal}>
                    {t('modals.closeBtn')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
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
                    {t('modals.submitBtn')}
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
};

const RenameChannelModal = ({ closeModal }) => {
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const { extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const channelNames = useSelector(selectors.selectChannelNames);
  const currentChannel = channels.find((channel) => channel.id === extra.channelId);

  const { emitApi } = useContext(SocketContext);

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
          <h4>{t('modals.renameChannelTitle')}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: currentChannel.name }}
          validationSchema={getValidationSchema(channelNames, t)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await emitApi.renameChannel({ id: currentChannel.id, name: values.name });
              closeModal();
            } catch (error) {
              setErrors({
                name: t('errors.sendError'),
              });
              throw error;
            }
          }}
        >
          {({
            isSubmitting, errors, touched, handleChange, values, handleSubmit, handleBlur,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control
                  name="name"
                  autoComplete="name"
                  id="name"
                  className="mb-2"
                  isInvalid={!!touched.name && !!errors.name}
                  autoFocus
                  disabled={isSubmitting}
                  data-testid="rename-channel"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  ref={inputRef}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
                <div className="d-flex justify-content-end">
                  <Button type="button" variant="secondary" className="me-2" onClick={closeModal}>
                    {t('modals.closeBtn')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
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
                    {t('modals.submitBtn')}
                  </Button>
                </div>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </>
  );
};

const RemoveChannelModal = ({ closeModal }) => {
  const { t } = useTranslation();

  const { extra } = useSelector(selectors.selectModalState);

  const channels = useSelector(selectors.selectChannels);
  const currentChannel = channels.find((channel) => channel.id === extra.channelId);

  const { emitApi } = useContext(SocketContext);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{t('modals.removeChannelTitle')}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: currentChannel.name }}
          validationSchema={null}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await emitApi.removeChannel({ id: currentChannel.id });
              closeModal();
            } catch (error) {
              setErrors({
                name: t('errors.sendError'),
              });
              throw error;
            }
          }}
        >
          {({
            isSubmitting, handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label
                  type="text"
                  className="lead"
                  data-testid="remove-channel"
                >
                  {t('modals.removeQuestion')}
                </Form.Label>
                <ErrorMessage name="name" component="div" className="text-danger" />
                <div className="d-flex justify-content-end">
                  <Button type="button" variant="secondary" className="me-2" onClick={closeModal}>
                    {t('modals.closeBtn')}
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    disabled={isSubmitting}
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
                    {t('modals.removeBtn')}
                  </Button>
                </div>
              </Form.Group>
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

  const closeModal = () => {
    dispatch(actions.closeModal());
  };

  if (!type) {
    return null;
  }

  // eslint-disable-next-line functional/no-let
  const modalWindowByType = {};
  modalWindowByType[modalTypes.addChannel] = AddChannelModal;
  modalWindowByType[modalTypes.removeChannel] = RemoveChannelModal;
  modalWindowByType[modalTypes.renameChannel] = RenameChannelModal;

  const ModalWindow = modalWindowByType[type];

  return (
    <Modal
      show={isOpened}
      onHide={closeModal}
      centered
    >
      <ModalWindow closeModal={closeModal} />
    </Modal>
  );
};

export default ChannelModal;
