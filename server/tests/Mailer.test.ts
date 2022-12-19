import { MailerData, MailerService } from '../src/services/MailerService';

const emailAddresses = [
  '123@test.com',
  '567@tester.com',
  'helloWorld@worldOfHello.com',
];
const subject = 'Welcome To Chapter!';
const htmlEmail = '<div><h1>Hello Test</h1></div>';

const data: MailerData = {
  emailList: emailAddresses,
  subject: subject,
  htmlEmail: htmlEmail,
};

describe('MailerService Class', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = new MailerService();

    const { auth, service } = mailer.transporter.options as any;
    expect(service).toEqual(mailer.emailService);
    expect(auth.user).toEqual(mailer.emailUsername);
    expect(auth.pass).toEqual(mailer.emailPassword);
  });

  it("Should use 'bcc' if sending to multiple email addresses", async () => {
    const mailer = new MailerService();
    const mockSendMail = jest
      .spyOn(mailer.transporter, 'sendMail')
      .mockImplementation(jest.fn());
    mailer.sendEmail(data);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ bcc: emailAddresses }),
    );
    expect(mockSendMail).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: expect.arrayContaining([]) }),
    );
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    new MailerService();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
