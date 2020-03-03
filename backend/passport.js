const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./schema/socialuser');
const keys = require('./key');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            console.log(accessToken);

            // const user = await new User({
            //     googleId: profile.id,
            //     email: profile.emails[0].value,
            //     name: profile.name.familyName + ' ' + profile.name.givenName,
            //     role: '' 
            // }).save();

            done(null, user);
        })
);