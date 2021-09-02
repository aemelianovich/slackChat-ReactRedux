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

    return messages || [];
  },
  selectChannels: (state) => state.channelsInfo.channels,
  selectChannelNames: (state) => state.channelsInfo.channels.map((channel) => channel.name),
  selectCurrentChannel: (state) => {
    const currentChannel = state.channelsInfo.channels.find(
      (channel) => (channel.id === state.channelsInfo.currentChannelId),
    );

    return currentChannel;
  },
};

export default selectors;
