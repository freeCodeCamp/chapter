import { Prisma } from '@prisma/client';
import { verify, sign } from 'jsonwebtoken';
import { Resolver, Arg, Mutation, Query, Ctx } from 'type-graphql';

import {
  AuthenticateType,
  LoginInput,
  LoginType,
  RegisterInput,
} from './inputs';
import { GQLCtx } from 'src/common-types/gql';
import { getConfig, isDev } from 'src/config';
import { User } from 'src/graphql-types';
import { prisma } from 'src/prisma';
import { authTokenService } from 'src/services/AuthToken';
import MailerService from 'src/services/MailerService';

type TokenResponseType = {
  email: string;
  code: string;
  iat: number;
  exp: number;
};

@Resolver()
export class AuthResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: GQLCtx): Promise<User | null> {
    return ctx.user || null;
  }

  @Mutation(() => User)
  async register(@Arg('data') data: RegisterInput): Promise<User> {
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('EMAIL_IN_USE');
    }

    const userData: Prisma.usersCreateInput = data;

    return await prisma.users.create({ data: userData });
  }

  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput): Promise<LoginType> {
    const user = await prisma.users.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const { token, code } = authTokenService.generateToken(user.email);
    if (isDev()) {
      console.log(
        `Code: ${code}\nhttp://localhost:3000/auth/token?token=${token}`,
      );
      await new MailerService(
        [data.email],
        'Login to Chapter',
        `<a href=http://localhost:3000/auth/token?token=${token}>Click here to log in to chapter</a>`,
      ).sendEmail();
    }

    // TODO: Send email in production

    return {
      code,
    };
  }

  @Mutation(() => AuthenticateType)
  async authenticate(@Arg('token') token: string): Promise<AuthenticateType> {
    let data: TokenResponseType;
    try {
      data = verify(token, getConfig('JWT_SECRET')) as TokenResponseType;
    } catch (e) {
      // TODO: Handle different parsing errors
      console.error(e);
      throw new Error('Token wrong / missing / expired');
    }

    const user = await prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const authToken = sign({ id: user.id }, getConfig('JWT_SECRET'), {
      expiresIn: '31d',
    });

    return {
      token: authToken,
      user,
    };
  }
}
