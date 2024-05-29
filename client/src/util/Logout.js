import Cookies from "js-cookie";

function handleSignOut (navigate) {
    Cookies.remove('COGNITO_TOKEN');
    navigate("/");
}

export default handleSignOut;
