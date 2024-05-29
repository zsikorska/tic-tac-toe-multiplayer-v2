import React, {useEffect} from "react";
import Cookies from 'js-cookie';
import {redirect, useNavigate} from "react-router-dom";

const Home = () => {
    const cognitoUrl = process.env.REACT_APP_COGNITO_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.href);
        const access_token = params.get('access_token');

        if (Cookies.get('COGNITO_TOKEN')) {
            navigate('/dashboard');
        } else if (access_token) {
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            Cookies.set('COGNITO_TOKEN', access_token, { secure: true, expires: expirationDate });
            navigate('/dashboard');
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
