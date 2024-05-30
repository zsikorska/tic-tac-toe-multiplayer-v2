import React, {useEffect, useState} from "react";
import handleSignOut from "./util/Logout";
import {useNavigate} from "react-router-dom";
import {Container, Table} from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import refreshSession from "./util/RefreshSession";

const History = () => {
    const navigate = useNavigate();

    function goBackToDashboard() {
        navigate('/dashboard');
    }

    function signOut() {
        handleSignOut(navigate)
    }

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const username = Cookies.get("USERNAME");
        fetchMatches(username).then(() => console.log('matches fetched'));
    }, []);

    const fetchMatches = async (playerName) => {
        if (!Cookies.get("COGNITO_TOKEN")) {
            refreshSession();
        }
        const token = Cookies.get("COGNITO_TOKEN");
        try {
            const BASE_URL = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.get(`${BASE_URL}/history?playerName=${playerName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMatches(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <div className="button-container">
                <button onClick={goBackToDashboard} className="signOutButton">Go back to dashboard</button>
                <button onClick={signOut} className="signOutButton">Sign Out</button>
            </div>
            <div className="main-div">
                <h1>History</h1>
                {matches.length > 0 && (
                    <Container>
                        <Table striped bordered hover className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Circle Player</th>
                                <th>Cross Player</th>
                                <th>Winner</th>
                                <th>Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {matches.map(match => (
                                <tr key={match.id}>
                                    <td>{match.id}</td>
                                    <td>{match.circle_player}</td>
                                    <td>{match.cross_player}</td>
                                    <td>{match.winner}</td>
                                    <td>{new Date(match.adjusted_created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                )}
                {matches.length === 0 && (
                    <h2 style={{marginTop: '20px'}}>No matches found</h2>
                )}
            </div>
        </div>
    );
}

export default History;
