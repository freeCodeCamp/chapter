import type { MailerData } from '../src/services/mail-providers/abstract-provider';
import { SMTPProvider } from '../src/services/mail-providers/smtp';

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

describe('SMTPProvider', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should assign the email username, password, and service to transporter', () => {
    const mailer = new SMTPProvider();

    /* @ts-expect-error we're accessing private properties for testing */
    const { auth, host } = mailer.transporter.options;

    expect(auth).toBeDefined();
    expect(host).toBeDefined();
    /* @ts-expect-error we're accessing private properties for testing */
    expect(host).toEqual(mailer.emailHost);
    /* @ts-expect-error we're accessing private properties for testing */
    expect(auth.user).toEqual(mailer.emailUsername);
    /* @ts-expect-error we're accessing private properties for testing */
    expect(auth.pass).toEqual(mailer.emailPassword);
  });

  it("Should use 'bcc' if sending to multiple email addresses", async () => {
    const mailer = new SMTPProvider();
    const mockSendMail = jest
      // @ts-expect-error we're accessing private properties for testing
      .spyOn(mailer.transporter, 'sendMail')
      .mockImplementation(jest.fn());
    mailer.send(data);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ bcc: emailAddresses }),
    );
    expect(mockSendMail).not.toHaveBeenCalledWith(
      expect.objectContaining({ to: expect.arrayContaining([]) }),
    );
  });

  it('Should log a warning if emailUsername, emailPassword, or emailService is not specified', () => {
    new SMTPProvider();
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
