const { createServer } = require("http");
const { Server } = require("socket.io");
const {CognitoJwtVerifier} = require("aws-jwt-verify");
const {connectToDb, initDb, insertMatch, selectMatchesByPlayer} = require("./db");
require('dotenv').config();

const httpServer = createServer();
httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    },
});

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.COGNITO_CLIENT_ID,
});

connectToDb();
initDb();


const allUsers = {};
const allRooms = [];

httpServer.on("request", (req, res) => {
    if (req.url === "/") {
        res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ status: "ok" }));
        res.end();
    }
    else if (req.url.startsWith("/history")) {
        if (req.method === "OPTIONS") {
            // Respond to the preflight request
            res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.writeHead(200);
            res.end();
        } else if (req.method === "GET") {
            res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            const token = req.headers.authorization;
            const accessToken = token ? token.split(' ')[1] : null;

            verifier.verify(accessToken)
                .then((payload) => {
                    const url = new URL(req.url, `https://${req.headers.host}`);
                    const playerName = url.searchParams.get("playerName");
                    selectMatchesByPlayer(playerName)
                        .then((result) => {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.write(JSON.stringify(result.rows));
                            res.end();
                        })
                        .catch((err) => {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ error: "Internal server error" }));
                            res.end();
                        });
                })
                .catch((err) => {
                    console.log("Token not valid!");
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ error: "Unauthorized" }));
                    res.end();
                });
        }
    }
    else if (req.url === "/match") {
        if (req.method === "OPTIONS") {
            // Respond to the preflight request
            res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.writeHead(200);
            res.end();
        } else if (req.method === "POST") {
            res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            const token = req.headers.authorization;
            const accessToken = token ? token.split(' ')[1] : null;

            verifier.verify(accessToken)
                .then((payload) => {
                    let body = [];
                    req.on("data", (chunk) => {
                        body.push(chunk);
                    });
                    req.on("end", () => {
                        body = Buffer.concat(body).toString();
                        const { circle_player, cross_player, winner } = JSON.parse(body);
                        insertMatch(circle_player, cross_player, winner)
                            .then((result) => {
                                res.writeHead(201, { "Content-Type": "application/json" });
                                res.end(JSON.stringify(result.rows[0]));
                            })
                            .catch((err) => {
                                res.writeHead(500, { "Content-Type": "application/json" });
                                res.end(JSON.stringify({ error: "Internal server error" }));
                            });
                    });
                })
                .catch((err) => {
                    console.log("Token not valid!");
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ error: "Unauthorized" }));
                    res.end();
                });
        }
    }
});

io.on("connection", async (socket) => {
    const token = socket.handshake.auth.token;
    try {
        const payload = await verifier.verify(token);
        console.log("Token is valid. Payload:", payload);
    } catch {
        console.log("Token not valid!");
        socket.disconnect();
    }

    allUsers[socket.id] = {
        socket: socket,
        online: true,
    };

    socket.on("request_to_play", (data) => {
        const currentUser = allUsers[socket.id];
        currentUser.playerName = data.playerName;

        let opponentPlayer;

        for (const key in allUsers) {
            const user = allUsers[key];
            if (user.playerName === currentUser.playerName) {
                continue;
            }
            if (user.online && !user.playing && socket.id !== key) {
                opponentPlayer = user;
                break;
            }
        }

        if (opponentPlayer) {
            allRooms.push({
                player1: opponentPlayer,
                player2: currentUser,
            });

            currentUser.playing = true;
            opponentPlayer.playing = true;

            currentUser.socket.emit("OpponentFound", {
                opponentName: opponentPlayer.playerName,
                playingAs: "circle",
            });

            opponentPlayer.socket.emit("OpponentFound", {
                opponentName: currentUser.playerName,
                playingAs: "cross",
            });

            currentUser.socket.on("playerMoveFromClient", (data) => {
                opponentPlayer.socket.emit("playerMoveFromServer", {
                    ...data,
                });
            });

            opponentPlayer.socket.on("playerMoveFromClient", (data) => {
                currentUser.socket.emit("playerMoveFromServer", {
                    ...data,
                });
            });
        } else {
            currentUser.socket.emit("OpponentNotFound");
        }
    });

    socket.on("disconnect", function () {
        const currentUser = allUsers[socket.id];
        currentUser.online = false;
        currentUser.playing = false;

        for (let index = 0; index < allRooms.length; index++) {
            const {player1, player2} = allRooms[index];

            if (player1.socket.id === socket.id) {
                allRooms.splice(index, 1);
                player2.socket.emit("opponentLeftMatch");
                break;
            }

            if (player2.socket.id === socket.id) {
                allRooms.splice(index, 1);
                player1.socket.emit("opponentLeftMatch");
                break;
            }
        }
    });
});
