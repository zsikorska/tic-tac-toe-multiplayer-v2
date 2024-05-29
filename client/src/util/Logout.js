import Cookies from "js-cookie";

function handleSignOut (navigate) {
    Cookies.remove('COGNITO_TOKEN');
    Cookies.remove('COGNITO_ID_TOKEN');
    Cookies.remove('COGNITO_REFRESH_TOKEN');
    navigate("/");
}

export default handleSignOut;
