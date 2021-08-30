const selectors = {
  selectModalState: (state) => state.modal,
  selectChannelMessages: (state) => {
    if (!state.channelsInfo.currentChannelId) {
      return [];
    }

    if (!state.messagesInfo.messages.length === 0) {
      return [];
    }

    const messages = state.messagesInfo.messages.filter(
      (message) => (message.channelId === state.channelsInfo.currentChannelId),
    );

    return messages;
  },
  selectChannels: (state) => state.channelsInfo.channels,
  selectCurrentChannelId: (state) => state.channelsInfo.currentChannelId,
  selectCurrentChannelInfo: (state) => {
    if (state.channelsInfo.channels.length === 0) {
      return {};
    }

    const [currentChannel] = state.channelsInfo.channels.filter(
      (channel) => (channel.id === state.channelsInfo.currentChannelId),
    );

    return currentChannel;
  },
};

export default selectors;
