import {auth} from 'express-oauth2-jwt-bearer';

const jwtcheck = auth({
    audience : "http://localhost:3000",
    issuerBaseURL : "https://dev-1u7ju166q720ebc3.us.auth0.com",
    tokenSigningAlg : "RS256"
})

export default jwtcheck;