const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const JwtStrategy = require('passport-jwt').Strategy;

// dotenv configuration if server.js is not configuring environment variables.
// const environmentFilename = require('../server');
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config({path: path.resolve(`${__dirname}`,`../${environmentFilename}`)});

// Use auth0 in passport as a strategy.
const auth0Strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0DOMAIN,
        clientID: process.env.AUTH0CLIENTID,
        clientSecret: process.env.AUTH0CLIENTSECRET,
        callbackURL: process.env.AUTH0CALLBACKURL,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
);

// Use JWT authenticating in passport.
const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: (req) => req.session.jwt,
        secretOrKey: process.env.JWTSECRET,
    },
    (payload, done) => {
        // TODO: add additional jwt token verification
        return done(null, payload);
    }
);

passport.use(auth0Strategy);
passport.use(jwtStrategy);

module.exports = passport;