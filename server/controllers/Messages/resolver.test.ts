import sinon from 'sinon';
import { expect } from 'chai';
import MailerService from '../../services/MailerService';

describe('Test sendEmail resolver', () => {
  it('Should accept args to, subject, and html', () => {
    const email = new MailerService(['test1@email.com'], 'subject', 'html');
    const spy = sinon.spy(email, 'sendEmail');
    email.sendEmail();
    expect(spy.calledOnce).to.be.true;
  });
});
