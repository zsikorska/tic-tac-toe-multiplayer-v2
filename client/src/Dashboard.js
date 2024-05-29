import React from "react";
import {useNavigate} from "react-router-dom";
import handleSignOut from "./util/Logout";

const Dashboard = () => {
    const navigate = useNavigate();

    function playClick() {
        navigate('/game');
    }

    function historyClick() {
        navigate('/history');
    }

    function signOut() {
        handleSignOut(navigate)
    }

    return (
        <div>
            <div className="right-button-container">
                <button onClick={signOut} className="signOutButton">Sign Out</button>
            </div>
            <div className="dashboard-div">
                <button onClick={playClick} className="dashboardButton">Play</button>
                <button onClick={historyClick} className="dashboardButton">History</button>
            </div>
        </div>
    );
}

export default Dashboard;
