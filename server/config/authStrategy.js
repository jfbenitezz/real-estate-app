const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../users/v1/user.model'); 

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  scope: ['profile', 'email', 
    'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        role: 'client', // Default role
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken
      });

      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
