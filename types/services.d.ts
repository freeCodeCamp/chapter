export interface IMailerService {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText: string;
  transporter: Transporter;
  ourEmail: string;
  emailUsername: string;
  emailPassword: string;
  emailService: string;
  sendEmail: () => void;
}
