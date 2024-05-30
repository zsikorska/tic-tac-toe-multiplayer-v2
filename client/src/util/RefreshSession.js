import Cookies from "js-cookie";

function refreshSession() {
    const tokenEndpoint = process.env.REACT_APP_COGNITO_TOKEN_URL;
    const cognitoClientId = process.env.REACT_APP_COGNITO_CLIENT_ID;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', cognitoClientId);
    body.append('refresh_token', Cookies.get('COGNITO_REFRESH_TOKEN'));

    fetch(tokenEndpoint, {
        method: 'POST',
        headers: headers,
        body: body
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const access_token = data.access_token;
            const id_token = data.id_token;

            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            Cookies.set('COGNITO_TOKEN', access_token, { secure: true, expires: expirationDate });
            Cookies.set('COGNITO_ID_TOKEN', id_token, { secure: true, expires: expirationDate });
        })
        .catch(error => {
            console.error(error);
        });
}

export default refreshSession;
