#!/bin/bash

if [ -d tic-tac-toe-multiplayer ]; then
    cd tic-tac-toe-multiplayer
else
    git clone git@github.com:zsikorska/tic-tac-toe-multiplayer.git
    cd tic-tac-toe-multiplayer
fi

git pull

docker build -t frontend:latest client
docker build -t backend:latest node-server

docker compose up -d