import passport from 'passport';
import { Strategy as MagicLinkStrategy } from 'passport-magic-link';
import { User } from '../../models';

export default function () {
  passport.use(
    new MagicLinkStrategy(
      {
        secret: process.env.MAGIC_LINK_SECRET,
        userFields: ['name', 'email'],
        tokenField: process.env.MAGIC_LINK_TOKEN_FIELD,
      },
      (user, token) => {
        // return MailService.sendMail({
        //   to: user.email,
        //   token,
        // });

        // if user is in database:
        console.log(`to: ${user.email}
        Click this link to login to Chapter: http://localhost:300/signin?token=${token}
        `);
      },
      (user) => {
        return User.findOne({ email: user.email });
      },
    ),
  );
}
