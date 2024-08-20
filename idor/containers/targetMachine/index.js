// app.js

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.json());

// Sample in-memory database
const users = [
    { id: 1, name: 'Alice', role: 'admin', secret: 'Admin Secret' },
    { id: 2, name: 'Bob', role: 'user', secret: 'User Secret' },
];

// Vulnerable endpoint
app.get('/user/:id/', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Here is the IDOR: It allows access to any user's secret based on the provided ID.
    res.json({ user });
});

/**
 * IDOR updates the profile of whatever userId is provided
 */
app.post('/updateProfile', (req, res) => {
    const { userId, newProfileData } = req.body;
    const user = users.find(u => u.id === userId);
    user.profile = newProfileData;
    res.json({ message: 'Profile updated' });
});

/**
 * IDOR provides access to get user info based on a header
 */
app.get('/getUserData', (req, res) => {
    const userId = parseInt(req.headers['x-user-id'], 10);
    const user = users.find(u => u.id === userId);
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


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
