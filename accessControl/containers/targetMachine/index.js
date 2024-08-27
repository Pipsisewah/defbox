// app.js

const express = require('express');
const database = require('./db');
const app = express();
const path = require('path');
const port = 3007;

app.use(express.json());


// Vulnerable endpoint
app.get('/test', async (req, res) => {
    res.json('Response!');
});

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await database.connect();
    await database.populate();
});

