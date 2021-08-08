import channelsReducer, { initChatData, setCurrentChannelId } from './channelsSlice';
import messagesReducer, { addMessage } from './messagesSlice';

const actions = {
  initChatData,
  setCurrentChannelId,
  addMessage,
};

export { channelsReducer, messagesReducer, actions };
