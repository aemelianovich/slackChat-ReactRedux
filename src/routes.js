// @ts-check

const host = (process.env.NODE_ENV === 'production') ? 'https://ae-chat-slack.herokuapp.com' : 'http://localhost:5000';
const prefix = 'api/v1';

export const rtkRoutes = {
  baseUrl: () => [host, prefix].join('/'),
  chatDataPath: () => [host, prefix, 'data'].join('/'),
};

export default {
  host,
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
  loginPath: () => [host, prefix, 'login'].join('/'),
  signupPath: () => [host, prefix, 'signup'].join('/'),
};
