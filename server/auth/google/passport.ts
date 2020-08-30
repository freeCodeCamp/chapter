import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../../models';

export default function() {
  passport.use(
    new GoogleStrategy(
      {
        consumerKey: process.env.GOOGLE_API_KEY,
        clientID: process.env.GOOGLE_CLIENT_ID,
        consumerSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async function(_accessToken, _refreshToken, profile, cb) {
        await User.findOneOrFail({ google_id: profile.id })
          .then(user => {
            if (user) {
              return cb(null, user);
            }
          })
          .catch(err => cb(err, null));
      },
    ),
  );
}
