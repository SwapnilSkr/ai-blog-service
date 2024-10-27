import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";
import { deserializeUser, serializeUser } from "../utils/helpers";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0].value });
        if (user) {
          done(null, user);
        } else {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.displayName,
          });
          done(null, user);
        }
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

export { passport };
