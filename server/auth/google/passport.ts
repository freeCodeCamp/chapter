import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../../models';

export default function() {
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser(async (googleId, done) => {
  //   const user = await User.findOne({ google_id: googleId });
  //   done(null, user);
  // });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async function(_accessToken, _refreshToken, profile, cb) {
        const user = await User.findOne({ google_id: profile.id });
        if (user) {
          return cb(null, user);
        } else {
          // Tmemporary untill we have way to create / add users to chapters
          const newUser = await User.create({
            google_id: profile.id,
            email: profile.email,
          });
          return cb(null, newUser);
        }
      },
    ),
  );
}
