import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
} from '@aws-sdk/client-ses';

import { MailerData, MailProvider } from './abstract-provider';

export class SESProvider extends MailProvider {
  private accessKeyId: string;
  private secretAccessKey: string;

  constructor() {
    super();
    if (!process.env.SES_ACCESS_KEY_ID || !process.env.SES_SECRET_ACCESS_KEY) {
      throw new Error('Email service is set to SES but missing required keys.');
    }
    this.accessKeyId = process.env.SES_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
  }

  async send(data: MailerData) {
    const awsConfig: SESClientConfig = {
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: 'us-east-1',
    };
    for (const email of data.emailList) {
      const opts = new SendEmailCommand({
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: data.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: data.htmlEmail || data.backupText || '',
            },
          },
        },
        Source: this.ourEmail,
      });

      await new SESClient(awsConfig).send(opts);
    }
  }
}
