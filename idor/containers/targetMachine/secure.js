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

function isTargetUserWithinSameCompany(user, targetUser){
    console.log(`user.companyId ${user.companyId} targetUser.companyId ${targetUser.companyId}`);
    return user.companyId === targetUser.companyId;
}

async function fetchUserFromToken(req, res, next) {
    try {
        extractBearerToken(req);
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    const token = await database.models.authTokens.findOne({token: req.authToken});
    if (!token) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    const user = await database.models.users.findOne({ employeeId: token.employeeId });
    if (!user) {
        return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
}

router.get('/user/:id/', fetchUserFromToken, async (req, res) => {
    const targetUserId = parseInt(req.params.id, 10);
    const targetUser = await database.models.users.findOne({employeeId: targetUserId});
    if(!targetUser){
        console.log(`Target User could not be found ${targetUserId}`);
        return res.status(403).json({ error: 'Not Authorized' });
    }
    if(!isTargetUserWithinSameCompany(req.user, targetUser)){
        return res.status(403).json({ error: 'Not Authorized' });
    }
    res.json({ user:targetUser });
});

router.post('/updateProfile', fetchUserFromToken, async (req, res) => {
    const { userId, newProfileData } = req.body;
    const targetUser = await database.models.users.findOne({ employeeId: userId });
    if(req.user.companyId !== targetUser.companyId) {
        return res.status(403).json('Invalid access');
    }
    const user = await database.models.users.findOne({ employeeId: userId });
    user.profile = newProfileData;
    await user.save();
    return res.json({ message: 'Profile updated' });
});

/**
 * IDOR provides access to get user info based on a header
 */
router.get('/getUserData',fetchUserFromToken, async (req, res) => {
    const targetUserId = parseInt(req.headers['x-user-id'], 10);
    const targetUser = await database.models.users.findOne({employeeId: targetUserId});
    if(!targetUser){
        console.log(`Target User could not be found ${targetUserId}`);
        return res.status(403).json({ error: 'Not Authorized' });
    }
    if(!isTargetUserWithinSameCompany(req.user, targetUser)){
        return res.status(403).json({ error: 'Not Authorized' });
    }
    const user = await database.models.users.findOne({ employeeId: userId });
    res.json({user});
});

router.get('/files/:filename',fetchUserFromToken, async (req, res) => {
    const filename = req.params.filename;
    const file = await database.models.files.findOne({fileName: filename});
    console.log(`File ${file}`);
    if(file.companyId !== req.user.companyId){
        return res.status(403).json({ error: 'Not Authorized' });
    }
    const filePath = path.join(__dirname, 'files', filename);
    console.log(`filePath: ${filePath}`);
    res.sendFile(filePath);
});

module.exports = router;