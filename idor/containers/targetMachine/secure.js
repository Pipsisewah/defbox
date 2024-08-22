const express = require('express');
const router = express.Router();
const database = require('./db');
const path = require('path');

function extractBearerToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        req.authToken = authHeader.split(' ')[1];
    } else {
       throw new Error('Authorization header missing or improperly formatted');
    }
}
async function fetchUserFromToken(req, res, next) {
    console.log(`auth, ${req.headers.authorization}`);
    extractBearerToken(req);
    const token = await database.models.authTokens.findOne({token: req.authToken});
    console.log(`token, ${token}`);
    if (!token) {
        return res.status(404).json({ error: 'Invalid token' });
    }
    const user = await database.models.users.findOne({ employeeId: token.employeeId });
    console.log(`user, ${JSON.stringify(user)}`);
    if (!user) {
        return res.status(404).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
}

router.get('/user/:id/', fetchUserFromToken, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    console.log(`userId, ${userId}`);
    //User Id Validation
    if(userId !== req.user.employeeId){
        return res.status(403).json({ error: 'Not Authorized' });
    }
    const user = await database.models.users.findOne({ employeeId: userId });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Here is the IDOR: It allows access to any user's secret based on the provided ID.
    res.json({ user });
});

module.exports = router;