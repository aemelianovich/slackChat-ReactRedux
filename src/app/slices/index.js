import channelsReducer, { initChatData, setCurrentChannelId } from './channelsSlice';
import messagesReducer from './messagesSlice';

const actions = {
  initChatData,
  setCurrentChannelId,
};

export { channelsReducer, messagesReducer, actions };
