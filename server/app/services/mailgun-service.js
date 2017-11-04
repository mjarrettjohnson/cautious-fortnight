import Mailgun from 'mailgun-js';
import Promise from 'bluebird';

const mailgun = Promise.promisifyAll(Mailgun);

export default class MailgunService {
  constructor({ apiKey, domain }) {
    if (!apiKey || !domain) {
      throw new Error('Mailgun credentials must be provided!');
    }

    this.mailgun = new mailgun({ apiKey, domain });
  }

  send(data) {
    const [isValid, response] = this.validate(data);
    if (!isValid) return response;
    return this.mailgun.messages().send(data);
  }

  validate({ from, to, subject, text }) {
    if (!from || !to || !subject || !text) {
      return [
        false,
        {
          status: 'error',
          message: 'Invalid email information provided',
        },
      ];
    }
    if (!this._fromFieldIsInCorrectFormat(from)) {
      return [
        false,
        { status: 'error', message: 'from field should be in the format Display Name <email@address.com>' },
      ];
    }
    return [true, ''];
  }

  _fromFieldIsInCorrectFormat(from) {
    return from.match(/\w+\s\w+\s<.+@.+\.\w+>/);
  }
}
