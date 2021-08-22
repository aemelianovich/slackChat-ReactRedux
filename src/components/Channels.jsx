// @ts-nocheck

import React, { useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Nav, Modal, Spinner, ButtonGroup, Dropdown,
} from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import * as Icon from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import {
  selectChannels, selectCurrentChannelId,
} from '../app/slices/channelsSlice.js';
import { actions } from '../app/slices';
import { selectModalState, modalTypes } from '../app/slices/modalSlice.js';
import { SocketContext } from './SocketContext.jsx';

const openModal = (type, channelId, dispatch) => () => {
  const extra = channelId ? { channelId } : null;
  dispatch(actions.openModal({
    type,
    extra,
  }));
};

const { addChannelModalType, removeChannelModalType, renameChannelModalType } = modalTypes;

const ChannelModalWindow = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const { isOpened, type, extra } = useSelector(selectModalState);
  const modalType = type;

  const channels = useSelector(selectChannels);
  const channelNames = channels.map((channel) => channel.name);
  const channelId = extra?.channelId || null;
  const [{ name: channelName }] = extra?.channelId
    ? channels.filter((channel) => channel.id === channelId)
    : [{ name: null }];

  const { emitMessage, emitTypes } = useContext(SocketContext);

  const modalWindowTypes = {
    [addChannelModalType]: {
      validationSchema: Yup.object().shape({
        name: Yup.string()
          .required(t(`channels.${addChannelModalType}.requiredName`))
          .min(3, t(`channels.${addChannelModalType}.nameLength`))
          .max(20, t(`channels.${addChannelModalType}.nameLength`))
          .notOneOf(channelNames, t(`channels.${addChannelModalType}.uniqueName`)),
      }),
      testId: 'add-channel',
      submitAction: (data) => emitMessage(emitTypes.newChannel, { name: data.name }),
      modalTitle: t(`channels.${addChannelModalType}.title`),
      closeBtnTitle: t(`channels.${addChannelModalType}.closeBtn`),
      submitBtnTitle: t(`channels.${addChannelModalType}.submitBtn`),
    },
    [renameChannelModalType]: {
      validationSchema: Yup.object().shape({
        name: Yup.string()
          .required(t(`channels.${renameChannelModalType}.requiredName`))
          .min(3, t(`channels.${renameChannelModalType}.nameLength`))
          .max(20, t(`channels.${renameChannelModalType}.nameLength`))
          .notOneOf(channelNames, t(`channels.${renameChannelModalType}.uniqueName`)),
      }),
      testId: 'rename-channel',
      submitAction: (data) => emitMessage(
        emitTypes.renameChannel,
        { id: channelId, name: data.name },
      ),
      modalTitle: t(`channels.${renameChannelModalType}.title`),
      closeBtnTitle: t(`channels.${renameChannelModalType}.closeBtn`),
      submitBtnTitle: t(`channels.${renameChannelModalType}.submitBtn`),
    },
    [removeChannelModalType]: {
      validationSchema: null,
      testId: 'remove-channel',
      submitAction: () => emitMessage(emitTypes.removeChannel, { id: channelId }),
      modalTitle: t(`channels.${removeChannelModalType}.title`),
      modalQuestion: t(`channels.${removeChannelModalType}.question`),
      closeBtnTitle: t(`channels.${removeChannelModalType}.closeBtn`),
      submitBtnTitle: t(`channels.${removeChannelModalType}.submitBtn`),
    },
  };

  const closeModal = () => {
    dispatch(actions.closeModal());
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  });

  if (!modalType) {
    return null;
  }
  return (
    <Modal
      show={isOpened}
      onHide={closeModal}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{modalWindowTypes[modalType].modalTitle}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            name: channelName || '',
          }}
          validationSchema={modalWindowTypes[modalType].validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async (values, { setErrors }) => {
            try {
              await modalWindowTypes[modalType].submitAction(values);
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
                {
                  (modalType === removeChannelModalType)
                    ? (
                      <>
                        <p
                          className="lead"
                          data-testid={modalWindowTypes[modalType].testId}
                        >
                          {modalWindowTypes[modalType].modalQuestion}
                        </p>
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                      </>
                    )
                    : (
                      <>
                        <Field
                          name="name"
                          autoComplete="name"
                          id="name"
                          className={`mb-2 form-control${errors.name && touched.name ? ' is-invalid' : ''}`}
                          autoFocus
                          disabled={isSubmitting}
                          data-testid={modalWindowTypes[modalType].testId}
                          innerRef={inputRef}
                        />
                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                      </>
                    )
                }
                <div className="d-flex justify-content-end">
                  <button type="button" className="me-2 btn btn-secondary" onClick={closeModal}>
                    {modalWindowTypes[modalType].closeBtnTitle}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn ${(modalType === removeChannelModalType) ? 'btn-danger' : 'btn-primary'}`}
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
                    {modalWindowTypes[modalType].submitBtnTitle}
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

const Channel = ({ channel }) => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <Nav.Item as="li" className="w-100">
      {channel.removable
        ? (
          <Dropdown
            as={ButtonGroup}
            className="d-flex"
          >
            <Button
              variant={(channel.id === currentChannelId) ? 'secondary' : ''}
              className="w-100 rounded-0 text-start text-truncate"
              onClick={() => dispatch(actions.setCurrentChannelId({ id: channel.id }))}
            >
              <span className="me-1">
                {t('channels.prefix')}
              </span>
              {channel.name}
            </Button>

            <Dropdown.Toggle
              split
              variant={(channel.id === currentChannelId) ? 'secondary' : ''}
              aria-haspopup
              className="flex-grow-0"
              id={`${channel.name}-dropdown-toggle`}
            />

            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={openModal(removeChannelModalType, channel.id, dispatch)}
              >
                {t('channels.removeChannel.dropDownTitle')}
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={openModal(renameChannelModalType, channel.id, dispatch)}
              >
                {t('channels.renameChannel.dropDownTitle')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
        : (
          <Button
            variant={(channel.id === currentChannelId) ? 'secondary' : ''}
            className="w-100 rounded-0 text-start"
            onClick={() => dispatch(actions.setCurrentChannelId({ id: channel.id }))}
          >
            <span className="me-1">
              {t('channels.prefix')}
            </span>
            {channel.name}
          </Button>
        )}
    </Nav.Item>
  );
};

const Channels = () => {
  const channels = useSelector(selectChannels);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column h-100 col-4 col-md-2 border-right pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channels.title')}</span>
        <Button variant="group-vertical" className="p-0 text-primary" onClick={openModal(addChannelModalType, null, dispatch)}>
          <Icon.PlusSquare />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      {(channels.length === 0)
        ? null
        : (
          <div
            className="pt-2 pb-2 h-100 overflow-auto"
          >
            <Nav as="ul" className="flex-column nav-pills nav-fill px-2">
              {channels.map((channel) => (<Channel channel={channel} key={channel.id} />))}
            </Nav>
          </div>
        )}
      <ChannelModalWindow />
    </div>
  );
};
export default Channels;
