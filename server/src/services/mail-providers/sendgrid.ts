import sendgrid, { MailDataRequired } from '@sendgrid/mail';

import { MailerData, MailProvider } from './abstract-provider';

export class SendgridProvider extends MailProvider {
  private sendgridKey: string;

  constructor() {
    super();
    if (!process.env.SENDGRID_KEY) {
      throw new Error(
        'Email service is set to SendGrid but missing required keys.',
      );
    }
    this.sendgridKey = process.env.SENDGRID_KEY;
    sendgrid.setApiKey(this.sendgridKey);
  }

  async send(data: MailerData) {
    for (const email of data.emailList) {
      const opts: MailDataRequired = {
        to: email,
        from: this.ourEmail,
        subject: data.subject,
        html: data.htmlEmail || data.backupText || '',
        trackingSettings: {
          clickTracking: {
            enable: false,
            enableText: false,
          },
          openTracking: {
            enable: false,
          },
          subscriptionTracking: {
            enable: false,
          },
        },
      };

      await sendgrid.send(opts);
    }
  }
}
