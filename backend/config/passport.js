const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ 
                    $or: [
                        { email: profile.emails[0].value },
                        { 'oauthProviders.providerId': profile.id }
                    ]
                });

                const userDetails = {
                    fullName: profile.displayName || 'Unnamed',
                    email: profile.emails[0]?.value || 'noemail@google.com',
                    username: profile.id,
                    isVerified: profile.emails[0]?.verified || false
                };

                if (!user) {
                    user = new User({
                        ...userDetails,
                        oauthProviders: [{
                            provider: 'google',
                            providerId: profile.id,
                            accessToken
                        }]
                    });
                } else {
                    user.lastLogin = new Date();
                    
                    const googleProviderIndex = user.oauthProviders.findIndex(
                        p => p.provider === 'google'
                    );

                    if (googleProviderIndex !== -1) {
                        user.oauthProviders[googleProviderIndex].accessToken = accessToken;
                    } else {
                        user.oauthProviders.push({
                            provider: 'google',
                            providerId: profile.id,
                            accessToken
                        });
                    }

                    Object.assign(user, userDetails);
                }

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ['user:email'],
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ 
                    $or: [
                        { email: profile.emails?.[0]?.value },
                        { 'oauthProviders.providerId': profile.id }
                    ]
                });

                const userDetails = {
                    fullName: profile.displayName || profile.username || 'Unnamed GitHub User',
                    email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                    username: profile.username,
                    profilePicture: profile.photos?.[0]?.value || null,
                    isVerified: !!profile.emails?.[0]?.value
                };

                if (!user) {
                    user = new User({
                        ...userDetails,
                        oauthProviders: [{
                            provider: 'github',
                            providerId: profile.id,
                            accessToken
                        }]
                    });
                } else {
                    user.lastLogin = new Date();
                    
                    const githubProviderIndex = user.oauthProviders.findIndex(
                        p => p.provider === 'github'
                    );
                    if (githubProviderIndex !== -1) {
                        user.oauthProviders[githubProviderIndex].accessToken = accessToken;
                    } else {
                        user.oauthProviders.push({
                            provider: 'github',
                            providerId: profile.id,
                            accessToken
                        });
                    }
                    
                    Object.assign(user, userDetails);
                }

                await user.save();
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
