import { Router } from 'express';

import Constants from './config/constants';
import MailgunService from './services/mailgun-service';
import NodemailerService from './services/nodemailer-service';

import EmailController from './controllers/email.controller';
import errorHandler from './middleware/error-handler';

const emailController = new EmailController(
  new MailgunService(Constants.mailgun),
  new NodemailerService(Constants.nodemailer)
);

const routes = new Router();

routes.post('/email', emailController.send);

routes.use(errorHandler);

export default routes;
