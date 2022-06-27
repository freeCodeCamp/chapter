import assert from 'assert';
import chai, { expect } from 'chai';
import { match, mock, stub, restore } from 'sinon';
import sinonChai from 'sinon-chai';

import MailerService, { MailerData } from '../src/services/MailerService';
import Utilities from '../src/util/Utilities';

chai.use(sinonChai);

beforeEach(() => {
  stub(console, 'warn');
});

afterEach(() => {
  // Restore the default sandbox here
  restore();
});

// Setup
const emailAddresses = [
  '123@test.com',
  '567@tester.com',
  'helloWorld@worldOfHello.com',
];
const subject = 'Welcome To Chapter!';
const htmlEmail = '<div><h1>Hello Test</h1></div>';
const backupText = 'Email html failed to load';
const calendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//sebbo.net//ical-generator//EN
BEGIN:VEVENT
UID:3b4a4873-161f-43e0-873d-10aa90488339
SEQUENCE:0
DTSTAMP:20220403T072207Z
DTSTART:20220325T234500Z
DTEND:20220326T014500Z
SUMMARY:Rolfson, Emmerich and Davis
URL;VALUE=URI:http://localhost:3000/events/15?emaillink=true
END:VEVENT
END:VCALENDAR`;

const data: MailerData = {
  emailList: emailAddresses,
  subject: subject,
  htmlEmail: htmlEmail,
};

const dataWithOptional: MailerData = {
  ...data,
  backupText: backupText,
  iCalEvent: calendar,
};

describe('MailerService Class', () => {
  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = new MailerService(dataWithOptional);

    const { auth, service } = mailer.transporter.options as any;
    assert.equal(service, mailer.emailService);
    assert.equal(auth.user, mailer.emailUsername);
    assert.equal(auth.pass, mailer.emailPassword);
  });

  it('Should correctly instantiate values', () => {
    const mailer = new MailerService(dataWithOptional);

    assert.equal(subject, mailer.subject);
    assert.equal(htmlEmail, mailer.htmlEmail);
    assert.equal(backupText, mailer.backupText);
    assert.equal(calendar, mailer.iCalEvent);
    expect(emailAddresses).to.have.members(mailer.emailList);
  });

  it("Should use 'bcc' if sending to multiple email addresses", async () => {
    const mailer = new MailerService(data);
    const mockSendMail = mock(mailer.transporter).expects('sendMail');
    mailer.sendEmail();

    expect(mockSendMail.calledOnceWith(match({ bcc: emailAddresses }))).to.be
      .true;
    expect(mockSendMail.neverCalledWith(match.has('to'))).to.be.true;
  });

  it('Should provide a blank string if backup text is undefined', () => {
    const mailer = new MailerService(data);
    assert.equal(mailer.backupText, '');
  });

  it('Should default iCalEvent to undefined', () => {
    const mailer = new MailerService(data);
    expect(mailer.iCalEvent).to.be.undefined;
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    stub(Utilities, 'allValuesAreDefined').callsFake(() => false);
    new MailerService(data);
    expect(console.warn).to.have.been.calledOnce;
  });
});
