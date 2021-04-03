import { expect } from 'chai';
import faker from 'faker';
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
      to: [faker.internet.email(), faker.internet.email()],
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
      to: [faker.internet.email(), faker.internet.email(), 'invalid.email'],
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

  it('Should reject the mutation call when a duplicate email address is found', async () => {
    const duplicateEmail = faker.internet.email();
    const emailData = {
      to: [duplicateEmail, faker.internet.email(), duplicateEmail],
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

  it('Should call the mutation and return an email object when all inputs pass validation', async () => {
    const fakeEmailAddress1 = faker.internet.email();
    const fakeEmailAddress2 = faker.internet.email();

    const emailData = {
      to: [fakeEmailAddress1, fakeEmailAddress2],
      subject: 'test',
      html: 'test html',
    };

    const expectedObject = {
      sendEmail: {
        emailList: [fakeEmailAddress1, fakeEmailAddress2],
        htmlEmail: emailData.html,
        ourEmail: 'ourEmail@placeholder.place',
        subject: emailData.subject,
      },
    };

    const email = await callSchema({
      source: emailMutation,
      variableValues: {
        data: emailData,
      },
    });

    expect(email.data).to.deep.equal(expectedObject);
  });
});
