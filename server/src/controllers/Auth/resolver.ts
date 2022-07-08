import { Prisma } from '@prisma/client';
import { verify, sign } from 'jsonwebtoken';
import { Resolver, Arg, Mutation, Query, Ctx } from 'type-graphql';

import { GQLCtx } from '../../common-types/gql';
import { getConfig, isDev } from '../../config';
import { User, UserWithInstanceRole } from '../../graphql-types';
import { prisma } from '../../prisma';
import { authTokenService } from '../../services/AuthToken';
import MailerService from '../../services/MailerService';
import {
  AuthenticateType,
  LoginInput,
  LoginType,
  RegisterInput,
} from './inputs';

type TokenResponseType = {
  email: string;
  code: string;
  iat: number;
  exp: number;
};

@Resolver()
export class AuthResolver {
  @Query(() => UserWithInstanceRole, { nullable: true })
  async me(@Ctx() ctx: GQLCtx): Promise<UserWithInstanceRole | null> {
    return ctx.user ?? null;
  }

  @Mutation(() => User)
  async register(@Arg('data') data: RegisterInput): Promise<User> {
    const existingUser = await prisma.users.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('EMAIL_IN_USE');
    }

    const instanceMember = await prisma.instance_roles.findUniqueOrThrow({
      where: { name: 'member' },
    });

    const userData: Prisma.usersCreateInput = {
      ...data,
      instance_role: {
        connect: {
          id: instanceMember.id,
        },
      },
    };

    return await prisma.users.create({ data: userData });
  }

  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput): Promise<LoginType> {
    const user = await prisma.users.findUnique({
      where: { email: data.email },
    });

    const { token, code } = authTokenService.generateToken(user.email);
    if (isDev()) {
      console.log(
        `Code: ${code}\nhttp://localhost:3000/auth/token?token=${token}`,
      );
      await new MailerService({
        emailList: [data.email],
        subject: 'Login to Chapter',
        htmlEmail: `<a href=http://localhost:3000/auth/token?token=${token}>Click here to log in to chapter</a>`,
      }).sendEmail();
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

    const user = await prisma.users.findUniqueOrThrow({
      where: { email: data.email },
      include: {
        instance_role: {
          include: {
            instance_role_permissions: {
              include: { instance_permission: true },
            },
          },
        },
      },
    });

    const authToken = sign({ id: user.id }, getConfig('JWT_SECRET'), {
      expiresIn: '31d',
    });

    return {
      token: authToken,
      user,
    };
  }
}
