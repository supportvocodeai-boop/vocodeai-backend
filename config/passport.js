import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1️⃣ Check if user already linked with Google
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2️⃣ Check if email already exists (manual signup user)
        user = await User.findOne({ email });

        if (user) {
          // 🔥 Attach googleId to existing user
          user.googleId = profile.id;
          await user.save();

          return done(null, user);
        }

        // 3️⃣ Create completely new user
        user = await User.create({
          googleId: profile.id,
          email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          isVerified: true,
        });

        return done(null, user);

      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;