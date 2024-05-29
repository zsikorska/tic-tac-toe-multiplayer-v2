import React from "react";
import handleSignOut from "./util/Logout";
import {useNavigate} from "react-router-dom";

const History = () => {
    const navigate = useNavigate();

    function goBackToDashboard() {
        navigate('/dashboard');
    }

    function signOut() {
        handleSignOut(navigate)
    }

    return (
        <div>
            <div className="button-container">
                <button onClick={goBackToDashboard} className="signOutButton">Go back to dashboard</button>
                <button onClick={signOut} className="signOutButton">Sign Out</button>
            </div>
            <div className="main-div">
                <h1>History</h1>
            </div>
        </div>
    );
}

export default History;
