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
import { openModal } from './ChannelModal.jsx';

const { addChannel, removeChannel, renameChannel } = modalTypes;

const Channel = ({ channel }) => {
  const currentChannel = useSelector(selectors.selectCurrentChannel);
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
              variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
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
              variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
              aria-haspopup
              className="flex-grow-0"
              id={`${channel.name}-dropdown-toggle`}
            />

            <Dropdown.Menu>
              <Dropdown.Item
                href="#"
                onClick={openModal(removeChannel, channel.id, dispatch)}
              >
                {t('channels.removeChannel.dropDownTitle')}
              </Dropdown.Item>
              <Dropdown.Item
                href="#"
                onClick={openModal(renameChannel, channel.id, dispatch)}
              >
                {t('channels.renameChannel.dropDownTitle')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
        : (
          <Button
            variant={(channel.id === currentChannel?.id) ? 'secondary' : ''}
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
  const channels = useSelector(selectors.selectChannels);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column h-100 col-4 col-md-2 border-right pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('channels.title')}</span>
        <Button variant="group-vertical" className="p-0 text-primary" onClick={openModal(addChannel, null, dispatch)}>
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
    </div>
  );
};
export default Channels;
