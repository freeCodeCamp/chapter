import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { User } from '../../models';

export default function() {
  passport.serializeUser((user, done) => {
    done(null, user.google_id);
  });

  passport.deserializeUser((googleId, done) => {
    User.findOne({ google_id: googleId }).then(user => {
      done(null, user);
    });
  });

  passport.use(
    new OAuth2Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async function(_accessToken, _refreshToken, profile, cb) {
        await User.findOne({ google_id: profile.id })
          .then(user => {
            if (user) {
              return cb(null, user);
            } else {
              // Tmemporary untill we have way to create / add users to chapters
              const newUser = User.create({
                google_id: profile.id,
                email: profile.email,
              });
              return cb(null, newUser);
            }
          })
          .catch(err => cb(err, null));
      },
    ),
  );
}
