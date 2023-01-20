export interface MailerData {
  emailList: Array<string>;
  subject: string;
  htmlEmail: string;
  backupText?: string;
}

export abstract class MailProvider {
  ourEmail: string;

  constructor() {
    this.ourEmail = process.env.CHAPTER_EMAIL || 'ourEmail@placeholder.place';
  }
  abstract send(data: MailerData): Promise<void>;
}
