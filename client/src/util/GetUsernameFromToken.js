const {CognitoJwtVerifier} = require("aws-jwt-verify");

async function getUsernameFromToken(token) {
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        tokenUse: "id",
        clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    });

    try {
        const payload = await verifier.verify(token);
        const username = payload["cognito:username"];
        console.log("Username:", username);
        return username;
    } catch {
        console.log("Username could not be retrieved from token!");
    }
}

export default getUsernameFromToken;