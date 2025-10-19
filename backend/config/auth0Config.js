import { auth } from 'express-oauth2-jwt-bearer';

const ISSUER_BASE_URL = "https://dev-1u7ju166q720ebc3.us.auth0.com";

const jwtcheck = auth({
    audience: "http://localhost:3000", 
    issuerBaseURL: ISSUER_BASE_URL, 
    tokenSigningAlg: "RS256",

    jwksUri: `${ISSUER_BASE_URL}/.well-known/jwks.json` 
})

export default jwtcheck;
