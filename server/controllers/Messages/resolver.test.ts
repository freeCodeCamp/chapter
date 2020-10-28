import { callSchema } from '../../testUtils/callSchema';
const faker = require('faker');

const emailMutation = `
  mutation Email($data: SendEmailInputs!) {
    sendEmail(
      data: $data
    ) {
      ourEmail
      emailList
      subject
      htmlEmail
    }
  }
`;

describe('Test sendEmail resolver', () => {
  it('Return an email object', async () => {
    const fakeEmailAddress1 = faker.internet.email();
    const fakeEmailAddress2 = faker.internet.email();
    const emailData = {
      to: [fakeEmailAddress1, fakeEmailAddress2],
      subject: 'test subject',
      html: 'test html',
    };

    const email = await callSchema({
      source: emailMutation,
      variableValues: {
        data: emailData,
      },
    });

    expect(email).toMatchObject({
      data: {
        sendEmail: {
          ourEmail: process.env.CHAPTER_EMAIL as string,
          emailList: emailData.to,
          subject: emailData.subject,
          htmlEmail: emailData.html,
        },
      },
    });
  });
});
