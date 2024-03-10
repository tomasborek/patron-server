import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.app.mail.host,
  port: 587 * 1,
  secure: false,
  auth: {
    user: config.app.mail.user,
    pass: config.app.mail.pass,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

export interface IMailer {
  sendEmail: (to: string, subject: string, html: string) => Promise<void>;
}

export default class Mailer implements IMailer {
  sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
      from: 'noreply@patronbox.cz',
      to,
      subject,
      html,
    });
  };
}
