import BaseController from './base.controller';
import MailService from '../services/mail-service';

class EmailController extends BaseController {
  constructor(mailgun, nodemailer) {
    super();
    this.whitelist = ['from', 'to', 'subject', 'text'];
    this.mailService = new MailService(mailgun, nodemailer);
  }

  send = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);
    const result = await this.mailService.send(params);
    if (!result || result.status === 'error') return res.status(404).json(result);
    res.status(200).json(result);
  };
}

export default EmailController;
