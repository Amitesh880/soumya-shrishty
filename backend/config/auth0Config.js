import { auth } from "express-oauth2-jwt-bearer";

const jwtcheck = auth({
  audience: process.env.AUTH0_AUDIENCE || "https://real-estate-backend-nine-opal.vercel.app",
  issuerBaseURL: "https://dev-1u7ju166q720ebc3.us.auth0.com",
  tokenSigningAlg: "RS256",
});

export default jwtcheck;
