import MailerService, { MailerData } from '../src/services/MailerService';

const emailAddresses = [
  '123@test.com',
  '567@tester.com',
  'helloWorld@worldOfHello.com',
];
const subject = 'Welcome To Chapter!';
const htmlEmail = '<div><h1>Hello Test</h1></div>';
const backupText = 'Email html failed to load';

const data: MailerData = {
  emailList: emailAddresses,
  subject: subject,
  htmlEmail: htmlEmail,
};

const dataWithOptional: MailerData = {
  ...data,
  backupText: backupText,
};

describe('MailerService Class', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = new MailerService(dataWithOptional);

    const { auth, service } = mailer.transporter.options as any;
    expect(service).toEqual(mailer.emailService);
    expect(auth.user).toEqual(mailer.emailUsername);
    expect(auth.pass).toEqual(mailer.emailPassword);
  });

  it('Should correctly instantiate values', () => {
    const mailer = new MailerService(dataWithOptional);

    expect(subject).toEqual(mailer.subject);
    expect(htmlEmail).toEqual(mailer.htmlEmail);
    expect(backupText).toEqual(mailer.backupText);
    expect(emailAddresses).toEqual(expect.arrayContaining(mailer.emailList));
  });

  it("Should use 'bcc' if sending to multiple email addresses", async () => {
    const mailer = new MailerService(data);
    const mockSendMail = jest
      .spyOn(mailer.transporter, 'sendMail')
      .mockImplementation(jest.fn());
    mailer.sendEmail();
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ bcc: emailAddresses }),
    );
    expect(mockSendMail).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: expect.arrayContaining([]) }),
    );
  });

  it('Should provide a blank string if backup text is undefined', () => {
    const mailer = new MailerService(data);
    expect(mailer.backupText).toEqual('');
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    // stub(Utilities, 'allValuesAreDefined').callsFake(() => false);
    new MailerService(data);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
