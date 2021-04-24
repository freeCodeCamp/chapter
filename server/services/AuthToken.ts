import jwt from 'jsonwebtoken';
import { getConfig } from 'server/config';

class AuthToken {
  private readonly secret: string;

  constructor() {
    this.secret = getConfig('JWT_SECRET');
  }

  public generateToken(email: string) {
    const code = AuthToken.generateCode();
    const token = jwt.sign({ email, code }, this.secret, {
      expiresIn: '120min',
    });

    return { token, code };
  }

  private static generateCode() {
    return Array.from(new Array(8), () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }
}

export const authTokenService = new AuthToken();
