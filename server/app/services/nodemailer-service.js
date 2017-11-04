import nodemailer from 'nodemailer';
import Promise from 'bluebird';

const mailer = Promise.promisifyAll(nodemailer);

export default class NodemailerService {
  constructor({ user, pass }) {
    if (!user || !pass) {
      throw new Error('Nodemailer credentials must be provided!');
    }
    this.mailer = mailer;

    this.transport = this._createTransport(user, pass);
  }

  _createTransport(user, pass) {
    return this.mailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  send(data) {
    const [isValid, response] = this.validate(data);
    if (!isValid) return response;
    return this.transport.sendMail(data);
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
