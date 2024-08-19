// app.js

const express = require('express');
const app = express();
const port = 3000;

// Sample in-memory database
const users = [
    { id: 1, name: 'Alice', role: 'admin', secret: 'Admin Secret' },
    { id: 2, name: 'Bob', role: 'user', secret: 'User Secret' },
];

// Middleware to simulate authentication
app.use((req, res, next) => {
    // In a real app, you'd authenticate users with a token or session.
    // For simplicity, we'll assume the user is always "Bob" with user ID 2.
    req.user = users[1]; // Bob
    next();
});

// Vulnerable endpoint
app.get('/user/:id/secret', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Here is the IDOR: It allows access to any user's secret based on the provided ID.
    res.json({ secret: user.secret });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
