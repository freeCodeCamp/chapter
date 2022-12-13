import mailerService, { MailerData } from '../src/services/MailerService';

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
URL;VALUE=URI:http://localhost:3000/events/15?ask_to_confirm=true
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
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = mailerService.loadValues(dataWithOptional);

    const { auth, service } = mailer.transporter.options as any;
    expect(service).toEqual(mailer.emailService);
    expect(auth.user).toEqual(mailer.emailUsername);
    expect(auth.pass).toEqual(mailer.emailPassword);
  });

  it('Should correctly instantiate values', () => {
    const mailer = mailerService.loadValues(dataWithOptional);

    expect(subject).toEqual(mailer.subject);
    expect(htmlEmail).toEqual(mailer.htmlEmail);
    expect(backupText).toEqual(mailer.backupText);
    expect(calendar).toEqual(mailer.iCalEvent);
    expect(emailAddresses).toEqual(expect.arrayContaining(mailer.emailList));
  });

  it("Should use 'bcc' if sending to multiple email addresses", async () => {
    const mailer = mailerService.loadValues(data);
    const mockSendMail = jest
      .spyOn(mailer.transporter, 'sendMail')
      .mockImplementation(jest.fn());
    mailerService.sendEmail(data);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ bcc: emailAddresses }),
    );
    expect(mockSendMail).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: expect.arrayContaining([]) }),
    );
  });

  it('Should provide a blank string if backup text is undefined', () => {
    const mailer = mailerService.loadValues(data);
    expect(mailer.backupText).toEqual('');
  });

  it('Should default iCalEvent to undefined', () => {
    const mailer = mailerService.loadValues(data);
    expect(mailer.iCalEvent).toBeUndefined();
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    // stub(Utilities, 'allValuesAreDefined').callsFake(() => false);
    mailerService.loadValues(data);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
