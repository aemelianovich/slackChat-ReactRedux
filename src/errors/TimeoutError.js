/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import i18n from 'i18next';

class TimeoutError extends Error {
  constructor() {
    const message = i18n.t('errors.timeoutError');
    super(message);
    this.name = 'TimeoutError';
    this.message = message;
    this.isTimeoutError = true;
  }
}
export default TimeoutError;
