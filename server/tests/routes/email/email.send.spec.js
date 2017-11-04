import { expect } from 'chai';
import MailService from '../../../app/services/mail-service';
import NodemailerService from '../../../app/services/nodemailer-service';
import MailgunService from '../../../app/services/mailgun-service';
import EmailFactory from '../../factories/email.factory';

describe('Mail Service', () => {
  let mailService;
  const sendSuccess = (data) => {
    return new Promise((resolve) => {
      resolve(successResult);
    });
  };

  const sendFailure = (data) => {
    throw new Error('Service Failed');
  };

  let successResult = { status: 'success', message: 'Email sent successfully' };

  it('should use the nodemailer service if mailgun fails', async () => {
    mailService = new MailService({ send: sendFailure }, { send: sendSuccess });
    const result = await mailService.send('');
    expect(result).to.deep.equal(successResult);
  });

  it('should return an error message if both services fail', async () => {
    mailService = new MailService({ send: sendFailure }, { send: sendFailure });
    const result = await mailService.send('');

    expect(result).to.have.property('status', 'error');
    expect(result).to.have.property('message');
    expect(result).to.have.property('body');
  });
});

describe('Mailgun Service', () => {
  const err = 'Mailgun credentials must be provided!';

  it('should throw an error if no api key and no domain is provided', (done) => {
    expect(() => new MailgunService({ apiKey: undefined, domain: undefined })).to.throw(err);
    done();
  });

  it('should throw an error if a api key is provided but no domain is provided', (done) => {
    expect(() => new MailgunService({ apiKey: '1234', domain: undefined })).to.throw(err);
    done();
  });

  it('should throw an error if no api key is provided but a domain is provided', (done) => {
    expect(() => new MailgunService({ apiKey: undefined, domain: 'www.test.com' })).to.throw(err);
    done();
  });

  describe('validation', () => {
    const mailGun = new MailgunService({ apiKey: '1234', domain: 'test.com' });
    it('should return an error message if no from property is provided', () => {
      const email = EmailFactory.generate();
      delete email.from;
      const result = mailGun.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no to property is provided', () => {
      const email = EmailFactory.generate();
      delete email.to;
      const result = mailGun.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no subject property is provided', () => {
      const email = EmailFactory.generate();
      delete email.subject;
      const result = mailGun.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no text property is provided', () => {
      const email = EmailFactory.generate();
      delete email.text;
      const result = mailGun.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if the from property is incorrectly formatted', () => {
      const email = EmailFactory.generate();
      const result = mailGun.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message', 'from field should be in the format Display Name <email@address.com>');
    });
  });
});

describe('Nodemailer Service', () => {
  const err = 'Nodemailer credentials must be provided!';

  it('should throw an error if no username and no password is provided', (done) => {
    expect(() => new NodemailerService({ user: undefined, pass: undefined })).to.throw(err);
    done();
  });

  it('should throw an error if a username is provided but no password is provided', (done) => {
    expect(() => new NodemailerService({ user: 'test', pass: undefined })).to.throw(err);
    done();
  });

  it('should throw an error if no username is provided but a password is provided', (done) => {
    expect(() => new NodemailerService({ user: undefined, pass: 'password' })).to.throw(err);
    done();
  });

  describe('validation', () => {
    const nodeMailer = new NodemailerService({ user: 'test', pass: 'test' });
    it('should return an error message if no from property is provided', () => {
      const email = EmailFactory.generate();
      delete email.from;
      const result = nodeMailer.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no to property is provided', () => {
      const email = EmailFactory.generate();
      delete email.to;
      const result = nodeMailer.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no subject property is provided', () => {
      const email = EmailFactory.generate();
      delete email.subject;
      const result = nodeMailer.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if no text property is provided', () => {
      const email = EmailFactory.generate();
      delete email.text;
      const result = nodeMailer.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message');
    });

    it('should return an error message if the from property is incorrectly formatted', () => {
      const email = EmailFactory.generate();
      const result = nodeMailer.send(email);
      expect(result.status).to.eq('error');
      expect(result).to.have.property('message', 'from field should be in the format Display Name <email@address.com>');
    });
  });
});
