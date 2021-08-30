import channelsReducer, { channelActions } from './channelsSlice';
import messagesReducer, { messageActions } from './messagesSlice';
import modalReducer, { modalActions } from './modalSlice';
import selectors from './selectors';

const actions = {
  ...channelActions,
  ...messageActions,
  ...modalActions,
};

const reducer = {
  channelsInfo: channelsReducer,
  messagesInfo: messagesReducer,
  modal: modalReducer,
};

export {
  reducer,
  actions,
  selectors,
};
