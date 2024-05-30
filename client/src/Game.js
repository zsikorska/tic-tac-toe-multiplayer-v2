import React, {useState, useEffect} from "react";
import Square from "./Square";
import {io} from "socket.io-client";
import handleSignOut from "./util/Logout";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import refreshSession from "./util/RefreshSession";
import axios from "axios";

const renderFrom = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

const Game = () => {
    const [gameState, setGameState] = useState(JSON.parse(JSON.stringify(renderFrom)));
    const [currentPlayer, setCurrentPlayer] = useState("circle");
    const [finishedState, setFinishedState] = useState(false);
    const [finishedArrayState, setFinishedArrayState] = useState([]);
    const [socket, setSocket] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [opponentName, setOpponentName] = useState(null);
    const [playingAs, setPlayingAs] = useState(null);
    const [isNewGame, setIsNewGame] = useState(false);
    const navigate = useNavigate();

    const checkWinner = () => {
        // row dynamic
        for (let row = 0; row < gameState.length; row++) {
            if (
                gameState[row][0] === gameState[row][1] &&
                gameState[row][1] === gameState[row][2]
            ) {
                setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
                return gameState[row][0];
            }
        }

        // column dynamic
        for (let col = 0; col < gameState.length; col++) {
            if (
                gameState[0][col] === gameState[1][col] &&
                gameState[1][col] === gameState[2][col]
            ) {
                setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
                return gameState[0][col];
            }
        }

        if (
            gameState[0][0] === gameState[1][1] &&
            gameState[1][1] === gameState[2][2]
        ) {
            setFinishedArrayState([0, 4, 8]);
            return gameState[0][0];
        }

        if (
            gameState[0][2] === gameState[1][1] &&
            gameState[1][1] === gameState[2][0]
        ) {
            setFinishedArrayState([2, 4, 6]);
            return gameState[0][2];
        }

        const isDrawMatch = gameState.flat().every((e) => {
            if (e === "circle" || e === "cross") return true;
        });

        if (isDrawMatch) return "draw";

        return null;
    };

    function addMatchToDb(winner) {
        if (!Cookies.get("COGNITO_TOKEN")) {
            refreshSession();
        }
        const token = Cookies.get("COGNITO_TOKEN");

        const match = {
            circle_player: playingAs === "circle" ? playerName : opponentName,
            cross_player: playingAs === "cross" ? playerName : opponentName,
            winner: winner,
        };

        const BASE_URL = process.env.REACT_APP_BACKEND_URL;

        axios.post(`${BASE_URL}/match`, match, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const winner = checkWinner();
        if (winner) {
            setFinishedState(winner)
            if (playingAs === "circle") {
                if (winner === "draw")
                    addMatchToDb("-");
                else
                    addMatchToDb(winner === "circle" ? playerName : opponentName);
            }
        }
    }, [gameState]);

    socket?.on("opponentLeftMatch", () => {
        setFinishedState("opponentLeftMatch");
    });

    socket?.on("playerMoveFromServer", (data) => {
        const id = data.state.id;
        setGameState((prevState) => {
            let newState = [...prevState];
            const rowIndex = Math.floor(id / 3);
            const colIndex = id % 3;
            newState[rowIndex][colIndex] = data.state.sign;
            return newState;
        });
        setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
    });

    socket?.on("OpponentNotFound", function () {
        setOpponentName(false);
    });

    socket?.on("OpponentFound", function (data) {
        setPlayingAs(data.playingAs);
        setOpponentName(data.opponentName);
    });

    function connectToServer() {
        if (!Cookies.get("COGNITO_TOKEN")) {
            refreshSession();
        }

        const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
            autoConnect: true,
            auth: {
                token: Cookies.get("COGNITO_TOKEN")
            }
        });

        newSocket?.emit("request_to_play", {
            playerName: playerName,
        });

        setSocket(newSocket);
    }

    useEffect(() => {
        setPlayerName(Cookies.get("USERNAME"));
        setIsNewGame(true);
        console.log("Player name:", Cookies.get("USERNAME"));
    }, []);

    useEffect(() => {
        if (isNewGame) {
            connectToServer();
            setIsNewGame(false);
        }
    }, [isNewGame]);

    function playAgainClick() {
        socket.disconnect();
        setGameState(JSON.parse(JSON.stringify(renderFrom)));
        setFinishedState(false);
        setFinishedArrayState([]);
        setCurrentPlayer("circle");
        setOpponentName(null);
        setPlayingAs(null);
        setIsNewGame(true);
    }

    function closeSocket() {
        if (socket) {
            socket.disconnect();
        }
    }

    function goBackToDashboard() {
        closeSocket();
        navigate('/dashboard');
    }

    function signOut() {
        closeSocket();
        handleSignOut(navigate)
    }

if (!opponentName) {
        return (
            <div>
                <div className="button-container">
                    <button onClick={goBackToDashboard} className="signOutButton">Go back to dashboard</button>
                    <button onClick={signOut} className="signOutButton">Sign Out</button>
                </div>
                <div className="waiting">
                    <p>Waiting for opponent</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="button-container">
                <button onClick={goBackToDashboard} className="signOutButton">Go back to dashboard</button>
                <button onClick={signOut} className="signOutButton">Sign Out</button>
            </div>
            <div className="main-div">
                <h1 className="game-heading water-background">Tic-tac-toe</h1>
                {!finishedState && opponentName && (
                    <h2>You are playing against {opponentName}</h2>
                )}
                {finishedState && finishedState === "opponentLeftMatch" && (
                        <h2>Opponent has left the game</h2>
                    )}
                    {finishedState &&
                        finishedState !== "opponentLeftMatch" &&
                        finishedState !== "draw" && (
                            <h3 className="finished-state">
                                {finishedState === playingAs ? "You " : "Your opponent"} won the
                                game
                            </h3>
                        )}
                    {finishedState &&
                        finishedState !== "opponentLeftMatch" &&
                        finishedState === "draw" && (
                            <h3 className="finished-state">It's a Draw</h3>
                        )}
                    {!finishedState && opponentName && (
                        <h2>
                            {currentPlayer === playingAs
                                ? "Your turn"
                                : "Your opponent's turn"}
                        </h2>
                    )}

                    <div className="move-detection">
                        <div
                            className={`left ${!finishedState &&
                            currentPlayer === playingAs ? "current-move-" + currentPlayer : ""
                            }`}
                        >
                            {playerName}: {playingAs === "circle" ? "O" : "X"}
                        </div>
                        <div
                            className={`right ${!finishedState &&
                            currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""
                            }`}
                        >
                            {opponentName}: {playingAs === "circle" ? "X" : "O"}
                        </div>
                    </div>
                    <div>
                        <div className="square-wrapper">
                            {gameState.map((arr, rowIndex) =>
                                arr.map((e, colIndex) => {
                                    return (
                                        <Square
                                            socket={socket}
                                            playingAs={playingAs}
                                            gameState={gameState}
                                            finishedArrayState={finishedArrayState}
                                            finishedState={finishedState}
                                            currentPlayer={currentPlayer}
                                            setCurrentPlayer={setCurrentPlayer}
                                            setGameState={setGameState}
                                            id={rowIndex * 3 + colIndex}
                                            key={rowIndex * 3 + colIndex}
                                            currentElement={e}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                    {finishedState && (
                        <button onClick={playAgainClick} className="playAgain">
                            Play again with a random player
                        </button>
                    )}
                </div>
        </div>
    );
};

export default Game;
