import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
} from '@aws-sdk/client-ses';

import { MailerData, MailProvider } from './abstract-provider';

export class SESProvider extends MailProvider {
  private SESClient: SESClient;

  constructor() {
    super();
    if (!process.env.SES_ACCESS_KEY_ID || !process.env.SES_SECRET_ACCESS_KEY) {
      throw new Error('Email service is set to SES but missing required keys.');
    }
    const awsConfig: SESClientConfig = {
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      },
      region: 'us-east-1',
    };
    this.SESClient = new SESClient(awsConfig);
  }

  async send(data: MailerData) {
    // TODO: batch into 50 emails per request
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/classes/sendemailcommand.html
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

      await this.SESClient.send(opts);
    }
  }
}
