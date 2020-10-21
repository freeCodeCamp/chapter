import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GoogleTokenStrategy } from 'passport-google-verify-token';
import { User } from '../../models';

export default function() {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId: any, done) => {
    const user = await User.findOne({ id: userId });
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      async function(_accessToken, _refreshToken, profile, cb) {
        const jsonProfile = profile._json;
        const user = await User.findOne({ google_id: jsonProfile.sub });
        // todo: add an update to get users most recent picture
        if (user) {
          return cb(null, user);
        } else {
          // Tmemporary untill we have way to create / add users to chapters
          const newUser = await new User({
            first_name: jsonProfile.given_name,
            last_name: jsonProfile.family_name,
            email: jsonProfile.email,
            google_id: jsonProfile.sub,
            google_picture: jsonProfile.picture,
          }).save();
          return cb(null, newUser);
        }
      },
    ),
  );

  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
      },
      async function(parsedToken, googleId, done) {
        const { given_name, family_name, email, picture } = parsedToken;
        const user = await User.findOne({ google_id: googleId });
        // // todo: add an update to get users most recent picture
        if (user) {
          return done(null, user);
        } else {
          // Tmemporary untill we have way to create / add users to chapters
          const newUser = await new User({
            first_name: given_name,
            last_name: family_name,
            email: email,
            google_id: googleId,
            google_picture: picture,
          }).save();
          return done(null, newUser);
        }
      },
    ),
  );
}
