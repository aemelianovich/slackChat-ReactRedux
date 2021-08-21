// @ts-check

const host = (process.env.NODE_ENV === 'production') ? 'https://ae-chat-slack.herokuapp.com' : 'http://localhost:5000';
const prefix = 'api/v1';

export const rtkRoutes = {
  baseUrl: () => [host, prefix].join('/'),
  chatDataPath: () => [host, prefix, 'data'].join('/'),
};

export default {
  host,
  channelsPath: () => [prefix, 'channels'].join('/'),
  channelPath: (id) => [prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [prefix, 'channels', id, 'messages'].join('/'),
  loginPath: () => [prefix, 'login'].join('/'),
  signupPath: () => [prefix, 'signup'].join('/'),
};
