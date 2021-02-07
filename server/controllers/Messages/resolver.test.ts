import { expect } from 'chai';
// const faker = require('faker');
import { callSchema } from '../../testUtils/callSchema';

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
  it('Should reject the mutation call when subject field has exceeded MaxLength', async () => {
    const emailData = {
      to: ['jonathan.seubert@megajon.com', 'finisher1017@gmail.com'],
      subject: 'test subject',
      html: 'test html',
    };

    const email = await callSchema({
      source: emailMutation,
      variableValues: {
        data: emailData,
      },
    });

    expect(email.errors[0].message).to.equal('Argument Validation Error');
  });

  it('Should reject the mutation call when email recipient list is empty', async () => {
    const emailData = {
      to: [],
      subject: 'test',
      html: 'test html',
    };

    const email = await callSchema({
      source: emailMutation,
      variableValues: {
        data: emailData,
      },
    });

    expect(email.errors[0].message).to.equal('Argument Validation Error');
  });

  it('Should reject the mutation call when there is an improperly formatted email in the list', async () => {
    const emailData = {
      to: [
        'jonathan.seubert@megajon.com',
        'finisher1017@gmail.com',
        'invalid.email',
      ],
      subject: 'test',
      html: 'test html',
    };

    const email = await callSchema({
      source: emailMutation,
      variableValues: {
        data: emailData,
      },
    });

    expect(email.errors[0].message).to.equal('Argument Validation Error');
  });

  // it('should return an email object', async () => {
  //   const fakeEmailAddress1 = faker.internet.email();
  //   const fakeEmailAddress2 = faker.internet.email();
  //   const emailData = {
  //     to: [fakeEmailAddress1, fakeEmailAddress2],
  //     subject: 'test subject',
  //     html: 'test html',
  //   };

  //   const email = await callSchema({
  //     source: emailMutation,
  //     variableValues: {
  //       data: emailData,
  //     },
  //   });

  //   console.log('email: ', email.data);
  // });
});
