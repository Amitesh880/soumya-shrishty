import { auth } from 'express-oauth2-jwt-bearer';

const ISSUER_BASE_URL = "https://dev-1u7ju166q720ebc3.us.auth0.com";
const API_IDENTIFIER = process.env.AUTH0_AUDIENCE || "http://localhost:3000";

const jwtcheck = auth({
  audience: API_IDENTIFIER,
  issuerBaseURL: ISSUER_BASE_URL,
  tokenSigningAlg: "RS256"
});

export default jwtcheck;