// @ts-check

// const host = (process.env.NODE_ENV === 'production') ? 'https://ae-chat-slack.herokuapp.com' : null;
const prefix = 'api/v1';

export default {
  // host,
  chatDataPath: () => [prefix, 'data'].join('/'),
  channelsPath: () => [prefix, 'channels'].join('/'),
  channelPath: (id) => [prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [prefix, 'channels', id, 'messages'].join('/'),
  loginPath: () => [prefix, 'login'].join('/'),
  signupPath: () => [prefix, 'signup'].join('/'),
};
