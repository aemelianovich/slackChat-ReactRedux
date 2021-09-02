import channelsReducer, { actions as channelActions } from './channelsSlice';
import messagesReducer, { actions as messageActions } from './messagesSlice';
import modalReducer, { actions as modalActions } from './modalSlice';
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
