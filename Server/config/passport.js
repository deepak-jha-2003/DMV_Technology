const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return done(err, null);
        if (results.length === 0) return done(null, false);
        done(null, results[0]);
    });
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in our database
        db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
            if (err) return done(err, null);
            
            if (results.length > 0) {
                // User exists, return the user
                return done(null, results[0]);
            } else {
                // Check if user exists with same email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    db.query('SELECT * FROM users WHERE email = ?', [email], (err, emailResults) => {
                        if (err) return done(err, null);
                        
                        if (emailResults.length > 0) {
                            // Update existing user with Google ID
                            db.query(
                                'UPDATE users SET google_id = ?, name = ?, profile_picture = ? WHERE email = ?',
                                [profile.id, profile.displayName, profile.photos[0]?.value, email],
                                (err) => {
                                    if (err) return done(err, null);
                                    return done(null, emailResults[0]);
                                }
                            );
                        } else {
                            // Create new user
                            const newUser = {
                                google_id: profile.id,
                                name: profile.displayName,
                                email: email,
                                profile_picture: profile.photos[0]?.value,
                                password: null // No password for OAuth users
                            };
                            
                            db.query(
                                'INSERT INTO users (google_id, name, email, profile_picture, password) VALUES (?, ?, ?, ?, ?)',
                                [newUser.google_id, newUser.name, newUser.email, newUser.profile_picture, newUser.password],
                                (err, result) => {
                                    if (err) return done(err, null);
                                    newUser.id = result.insertId;
                                    return done(null, newUser);
                                }
                            );
                        }
                    });
                } else {
                    return done(new Error('No email found in Google profile'), null);
                }
            }
        });
    } catch (error) {
        return done(error, null);
    }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in our database
        db.query('SELECT * FROM users WHERE facebook_id = ?', [profile.id], (err, results) => {
            if (err) return done(err, null);
            
            if (results.length > 0) {
                // User exists, return the user
                return done(null, results[0]);
            } else {
                // Check if user exists with same email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    db.query('SELECT * FROM users WHERE email = ?', [email], (err, emailResults) => {
                        if (err) return done(err, null);
                        
                        if (emailResults.length > 0) {
                            // Update existing user with Facebook ID
                            db.query(
                                'UPDATE users SET facebook_id = ?, name = ?, profile_picture = ? WHERE email = ?',
                                [profile.id, profile.displayName, profile.photos[0]?.value, email],
                                (err) => {
                                    if (err) return done(err, null);
                                    return done(null, emailResults[0]);
                                }
                            );
                        } else {
                            // Create new user
                            const newUser = {
                                facebook_id: profile.id,
                                name: profile.displayName,
                                email: email,
                                profile_picture: profile.photos[0]?.value,
                                password: null // No password for OAuth users
                            };
                            
                            db.query(
                                'INSERT INTO users (facebook_id, name, email, profile_picture, password) VALUES (?, ?, ?, ?, ?)',
                                [newUser.facebook_id, newUser.name, newUser.email, newUser.profile_picture, newUser.password],
                                (err, result) => {
                                    if (err) return done(err, null);
                                    newUser.id = result.insertId;
                                    return done(null, newUser);
                                }
                            );
                        }
                    });
                } else {
                    return done(new Error('No email found in Facebook profile'), null);
                }
            }
        });
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
