const express = require('express');
const app = express();
// const { auth } = require('express-oauth2-jwt-bearer');
// const jwt = require('express-jwt').jwt;
const jwksRsa = require('jwks-rsa');
const { expressjwt: jwt } = require("express-jwt");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
// const checkJwt = auth({
//   audience: 'undefined',
//   issuerBaseURL: `https://dev-ymfo-vr1.eu.auth0.com/`,
// });



const checkJwt = jwt({
  secret: jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://dev-ymfo-vr1.eu.auth0.com/.well-known/jwks.json`
  }),
  audience: `https://dev-ymfo-vr1.eu.auth0.com/api/v2/`,
  issuer: `https://dev-ymfo-vr1.eu.auth0.com/`,
  algorithms: ['RS256']
})


module.exports = checkJwt;