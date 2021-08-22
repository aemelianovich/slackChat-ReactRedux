import channelsReducer,
{
  fetchChatData, addChannel, setCurrentChannelId, renameChannel, removeChannel,
} from './channelsSlice';
import messagesReducer, { addMessage } from './messagesSlice';
import modalReducer, { openModal, closeModal } from './modalSlice';

const actions = {
  fetchChatData,
  addChannel,
  renameChannel,
  removeChannel,
  setCurrentChannelId,
  addMessage,
  openModal,
  closeModal,
};

export {
  channelsReducer,
  messagesReducer,
  modalReducer,
  actions,
};
