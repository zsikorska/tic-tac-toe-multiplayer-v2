const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');

const dbConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync('cert/us-east-1-bundle.pem').toString()
    }
};

const client = new Client(dbConfig);


function connectToDb() {
    client.connect()
        .then(() => console.log('Connected to database'))
        .catch(e => console.error('Database connection error', e.stack))
}

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS match (
        id SERIAL PRIMARY KEY,
        circle_player VARCHAR(255) NOT NULL,
        cross_player VARCHAR(255) NOT NULL,
        winner VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

function initDb() {
    client.query(createTableQuery, (err, res) => {
        if (err) {
            console.error('Error creating table', err.stack);
        } else {
            console.log('Table created successfully');
        }
    });
}

const insertMatchQuery = `
    INSERT INTO match (circle_player, cross_player, winner, created_at)
    VALUES ($1, $2, $3, NOW() AT TIME ZONE 'Europe/Warsaw')
    RETURNING *;
`;

function insertMatch(circlePlayer, crossPlayer, winner) {
    return client.query(insertMatchQuery, [circlePlayer, crossPlayer, winner]);
}

const selectMatchesByPlayerQuery = `
    SELECT * FROM match
    WHERE circle_player = $1 OR cross_player = $1;
`;

function selectMatchesByPlayer(player) {
    return client.query(selectMatchesByPlayerQuery, [player]);
}

module.exports = { client, connectToDb, initDb, insertMatch, selectMatchesByPlayer };
