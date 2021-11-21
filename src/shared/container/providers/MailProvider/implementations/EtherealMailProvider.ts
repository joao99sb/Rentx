import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';

import { IMailProvider } from '../IMailProvider';

@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch(err => console.log(err));
  }

  public async sendMail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: 'Rentx <noreplay@micro.com>',
      text: body,
      html: body,
    });
    console.log(`message sent: ${message.messageId}`);
    console.log(`message URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}
