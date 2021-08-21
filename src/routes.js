// @ts-check

const host = (process.env.NODE_ENV === 'production') ? 'https://ae-chat-slack.herokuapp.com' : '';
const prefix = 'api/v1';

export default {
  host,
  chatDataPath: () => [host, prefix, 'data'].join('/'),
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),
};
