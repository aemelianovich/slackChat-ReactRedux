/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import i18n from 'i18next';

class SocketConnectionError extends Error {
  constructor() {
    const message = i18n.t('errors.socketError');
    super(message);
    this.name = 'SocketConnectionError';
    this.message = message;
    this.isSocketError = true;
  }
}
export default SocketConnectionError;
