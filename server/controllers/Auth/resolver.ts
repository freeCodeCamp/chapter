import { Resolver, Arg, Mutation } from 'type-graphql';
import {} from 'jsonwebtoken';

import { User } from '../../models';
import { LoginInput, LoginType, RegisterInput } from './inputs';

@Resolver()
export class AuthResolver {
  @Mutation(() => User)
  async register(@Arg('data') data: RegisterInput) {
    let user = await User.findOne({ where: { email: data.email } });
    if (user) {
      throw new Error('EMAIL_IN_USE');
    }

    user = new User({ ...data });
    await user.save();

    return user;
  }

  @Mutation(() => LoginType)
  async login(@Arg('data') data: LoginInput) {
    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // TODO: Send email

    return {
      code: 'foobar',
    };
  }
}
