export default class MailService {
  constructor(mailGunService, nodeMailerService) {
    this.mailGunService = mailGunService;
    this.nodeMailerService = nodeMailerService;
  }

  success = {
    status: 'success',
    message: 'Email sent successfully',
  };

  _sendErr(err) {
    return {
      status: 'error',
      message: 'Email was unable to send :(',
      body: err,
    };
  }

  async send(data) {
    try {
      return await this._sendViaMailGun(data);
    } catch (e) {
      try {
        return await this._sendViaNodeMailer(data);
      } catch (err) {
        return this._sendErr(err);
      }
    }
  }

  async _sendViaNodeMailer(data) {
    await this.nodeMailerService.send(data);
    return this.success;
  }

  async _sendViaMailGun(data) {
    await this.mailGunService.send(data);
    return this.success;
  }
}
