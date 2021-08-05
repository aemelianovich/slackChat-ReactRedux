// @ts-check

import React from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { Button, Nav } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { selectChannels, selectCurrentChannelId } from '../app/slices/channelsSlice.js';
import { actions } from '../app/slices';

const renderChannels = (channels, currentChannelId, dispatch) => {
  if (channels.length === 0) {
    return null;
  }

  return (
    <Nav as="ul" className="flex-column nav-pills nav-fill px-2">
      {channels.map((channel) => (
        <Nav.Item as="li" className="w-100" key={channel.id}>
          <Button
            variant={(channel.id === currentChannelId) ? 'secondary' : ''}
            className="w-100 rounded-0 text-left"
            onClick={() => dispatch(actions.setCurrentChannelId({ id: channel.id }))}
          >
            <span className="mr-1">
              #
            </span>
            {channel.name}
          </Button>
        </Nav.Item>
      ))}
    </Nav>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels, shallowEqual);
  const currentChannelId = useSelector(selectCurrentChannelId);

  return (
    <div className="col-4 col-md-2 border-right pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ml-3 ps-2 pe-1 px-2">
        <span>Каналы</span>
        <Button variant="group-vertical" className="p-0 text-primary">
          <Icon.PlusSquare />
        </Button>
      </div>
      {renderChannels(channels, currentChannelId, dispatch)}
    </div>
  );
};
export default Channels;
