/**
 * Auth0 Configuration
 * Handles token verification from Auth0
 */
const { auth } = require("express-oauth2-jwt-bearer");

// Auth0 JWT Validator Middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

module.exports = { checkJwt };
