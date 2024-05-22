import React, {useState, useEffect} from "react";
import "./App.css";
import Square from "./Square";
import {io} from "socket.io-client";
import Swal from "sweetalert2";

const renderFrom = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

const App = () => {
    const [gameState, setGameState] = useState(JSON.parse(JSON.stringify(renderFrom)));
    const [currentPlayer, setCurrentPlayer] = useState("circle");
    const [finishedState, setFinishedState] = useState(false);
    const [finishedArrayState, setFinishedArrayState] = useState([]);
    const [playOnline, setPlayOnline] = useState(false);
    const [socket, setSocket] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [opponentName, setOpponentName] = useState(null);
    const [playingAs, setPlayingAs] = useState(null);
    const [isNewGame, setIsNewGame] = useState(false);

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

    useEffect(() => {
        const winner = checkWinner();
        if (winner) {
            setFinishedState(winner);
        }
    }, [gameState]);

    const takePlayerName = async () => {
        const result = await Swal.fire({
            title: "Enter your name",
            input: "text",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            },
        });

        return result;
    };

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

    socket?.on("connect", function () {
        setPlayOnline(true);
    });

    socket?.on("OpponentNotFound", function () {
        setOpponentName(false);
    });

    socket?.on("OpponentFound", function (data) {
        setPlayingAs(data.playingAs);
        setOpponentName(data.opponentName);
    });


    function connectToServer() {
        const newSocket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:3000", {
            autoConnect: true,
        });

        newSocket?.emit("request_to_play", {
            playerName: playerName,
        });

        setSocket(newSocket);
    }

    async function playOnlineClick() {
        const result = await takePlayerName();

        if (!result.isConfirmed) {
            return;
        }

        const username = result.value;
        setPlayerName(username);
        setIsNewGame(true);
    }

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
        setPlayOnline(false);
        setIsNewGame(true);
    }

    if (!playOnline) {
        return (
            <div className="main-div">
                <button onClick={playOnlineClick} className="playOnline">
                    Play Tic-tac-toe with a random player
                </button>
            </div>
        );
    }

    if (playOnline && !opponentName) {
        return (
            <div className="waiting">
                <p>Waiting for opponent</p>
            </div>
        );
    }

    return (
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
    );
};

export default App;
