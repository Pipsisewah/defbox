// app.js

const express = require('express');
const database = require('./db');
const app = express();
const path = require('path');
const port = 3005;

app.use(express.json());




// Vulnerable endpoint
app.get('/user/:id/', async (req, res) => {
    await database.connection.collection('users').insertOne({"name": "Amber", "role": "Admin"});
    const userId = parseInt(req.params.id, 10);
    const user = await database.models.users.findOne({ employeeId: userId });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Here is the IDOR: It allows access to any user's secret based on the provided ID.
    res.json({ user });
});

/**
 * IDOR updates the profile of whatever userId is provided
 */
app.post('/updateProfile', async (req, res) => {
    const { userId, newProfileData } = req.body;
    const user = await database.models.users.findOne({ employeeId: userId });
    user.profile = newProfileData;
    await user.save();
    res.json({ message: 'Profile updated' });
});

/**
 * IDOR provides access to get user info based on a header
 */
app.get('/getUserData', async (req, res) => {
    const userId = parseInt(req.headers['x-user-id'], 10);
    const user = await database.models.users.findOne({ employeeId: userId });
    res.json({user});
});

/**
 * IDOR allows access to any file requested
 */
app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);
    console.log(`filePath: ${filePath}`);
    res.sendFile(filePath);
});


app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await database.connect();
    await database.populate();
});

