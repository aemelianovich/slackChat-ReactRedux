// @ts-check

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Nav } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { selectChannels, selectCurrentChannelId } from '../app/slices/channelsSlice.js';
import { actions } from '../app/slices';

const Channel = ({ channel }) => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();

  return (
    <Nav.Item as="li" className="w-100">
      <Button
        variant={(channel.id === currentChannelId) ? 'secondary' : ''}
        className="w-100 rounded-0 text-left"
        onClick={() => dispatch(actions.setCurrentChannelId({ id: channel.id }))}
      >
        <span className="mr-1">
          {t('channels.prefix')}
        </span>
        {channel.name}
      </Button>
    </Nav.Item>
  );
};

const Channels = () => {
  const channels = useSelector(selectChannels);
  const { t } = useTranslation();

  return (
    <div className="col-4 col-md-2 border-right pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ml-3 ps-2 pe-1 px-2">
        <span>{t('channels.title')}</span>
        <Button variant="group-vertical" className="p-0 text-primary">
          <Icon.PlusSquare />
        </Button>
      </div>
      {(channels.length === 0)
        ? null
        : (
          <Nav as="ul" className="flex-column nav-pills nav-fill px-2">
            {channels.map((channel) => (<Channel channel={channel} key={channel.id} />))}
          </Nav>
        )}
    </div>
  );
};
export default Channels;
