const express = require('express');
const vulnerableRoutes = require('./vulnerable');
const secureRoutes = require('./secure');
const app = express();
const database = require('./db');
const port = 3005;

app.use(express.json());
app.use('/vulnerabilities', vulnerableRoutes);
app.use('/secure', secureRoutes);

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await database.connect();
    await database.populate();
});