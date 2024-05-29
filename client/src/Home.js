import React, {useEffect} from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import getUsernameFromToken from "./util/GetUsernameFromToken";

const Home = () => {
    const cognitoUrl = process.env.REACT_APP_COGNITO_URL;
    const cognitoClientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const cognitoRedirectUrl = process.env.REACT_APP_COGNITO_REDIRECT_URL;
    const tokenEndpoint = process.env.REACT_APP_COGNITO_TOKEN_URL;
    const navigate = useNavigate();

    useEffect(() => {
        console.log(window.location.href);
        const params = new URLSearchParams(window.location.href.split('?')[1]);
        const code = params.get('code');
        console.log(code);

        if (code) {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            const body = new URLSearchParams();
            body.append('grant_type', 'authorization_code');
            body.append('client_id', cognitoClientId);
            body.append('redirect_uri', cognitoRedirectUrl);
            body.append('code', code);

            fetch(tokenEndpoint, {
                method: 'POST',
                headers: headers,
                body: body
            })
                .then(response => response.json())
                .then(async data => {
                    console.log(data);
                    const access_token = data.access_token;
                    const id_token = data.id_token;
                    const refresh_token = data.refresh_token;

                    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                    Cookies.set('COGNITO_TOKEN', access_token, {secure: true, expires: expirationDate});
                    Cookies.set('COGNITO_ID_TOKEN', id_token, {secure: true, expires: expirationDate});
                    Cookies.set('COGNITO_REFRESH_TOKEN', refresh_token, {secure: true});

                    const username = await getUsernameFromToken(id_token);
                    Cookies.set('USERNAME', username, {secure: true});

                    navigate("/dashboard");
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [navigate]);

    function handleButtonClick() {
        console.log(cognitoUrl)
        window.location.href = cognitoUrl;
    }

    return (
        <div className="main-div">
            <button className="homeButton" onClick={handleButtonClick}>
                Play Tic-tac-toe with random players
            </button>
        </div>
    );
}

export default Home;
