// @ts-check

const prefix = 'api/v1';

export default {
  chatDataPath: () => [prefix, 'data'].join('/'),
  channelsPath: () => [prefix, 'channels'].join('/'),
  channelPath: (id) => [prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [prefix, 'channels', id, 'messages'].join('/'),
  loginPath: () => [prefix, 'login'].join('/'),
  signupPath: () => [prefix, 'signup'].join('/'),
};
