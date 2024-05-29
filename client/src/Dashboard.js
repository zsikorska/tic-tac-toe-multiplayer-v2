import React from "react";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    function playClick() {
        navigate('/game');
    }

    function historyClick() {
        navigate('/history');
    }

    return (
        <div className="dashboard-div">
            <button onClick={playClick} className="dashboardButton">Play</button>
            <button onClick={historyClick} className="dashboardButton">History</button>
        </div>
    );
}

export default Dashboard;
