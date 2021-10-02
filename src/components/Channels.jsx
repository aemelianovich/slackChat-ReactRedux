// @ts-nocheck

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Nav, ButtonGroup, Dropdown,
} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { actions, selectors } from '../slices';
import { modalTypes } from '../slices/modalSlice.js';

const { addChannel, removeChannel, renameChannel } = modalTypes;

const Channel = ({
  channel,
  currentChannel,
  openRemoveModal,
  openRenameModal,
  setCurrentChannel,
  t,
}) => (
  <Nav.Item as="li" className="w-100">
    {channel.removable
      ? (
        <Dropdown
          as={ButtonGroup}
          className="d-flex"
        >
          <Button
            variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
            className="w-100 rounded-0 text-start text-truncate"
            onClick={setCurrentChannel(channel.id)}
          >
            <span className="me-1">
              {t('channels.prefix')}
            </span>
            {channel.name}
          </Button>

          <Dropdown.Toggle
            split
            variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
            aria-haspopup
            className="flex-grow-0"
            id={`${channel.name}-dropdown-toggle`}
          />

          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={openRemoveModal(channel.id)}
            >
              {t('channels.removeOption')}
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={openRenameModal(channel.id)}
            >
              {t('channels.renameOption')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
      : (
        <Button
          variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
          className="w-100 rounded-0 text-start"
          onClick={setCurrentChannel(channel.id)}
        >
          <span className="me-1">
            {t('channels.prefix')}
          </span>
          {channel.name}
        </Button>
      )}
  </Nav.Item>
);

const Channels = () => {
  const channels = useSelector(selectors.selectChannels);
  const currentChannel = useSelector(selectors.selectCurrentChannel);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openAddModal = () => {
    dispatch(actions.openModal({
      type: addChannel,
      extra: null,
    }));
  };

  const openRemoveModal = (channelId) => () => {
    dispatch(actions.openModal({
      type: removeChannel,
      extra: { channelId },
    }));
  };

  const openRenameModal = (channelId) => () => {
    dispatch(actions.openModal({
      type: renameChannel,
      extra: { channelId },
    }));
  };

  const setCurrentChannel = (channelId) => () => {
    dispatch(actions.setCurrentChannelId({ id: channelId }));
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channels.title')}</span>
        <Button variant="group-vertical" className="p-0 text-primary" onClick={openAddModal}>
          <Icon.PlusSquare />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <div className="pt-2 pb-2 h-100 overflow-auto">
        <Nav as="ul" className="flex-column nav-pills nav-fill px-2">
          {channels.map((channel) => (
            <Channel
              channel={channel}
              key={channel.id}
              currentChannel={currentChannel}
              openRemoveModal={openRemoveModal}
              openRenameModal={openRenameModal}
              setCurrentChannel={setCurrentChannel}
              t={t}
            />
          ))}
        </Nav>
      </div>
    </>
  );
};
export default Channels;
