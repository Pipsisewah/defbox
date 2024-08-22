const express = require('express');
const router = express.Router();
const database = require('./db');
const path = require('path');

router.get('/user/:id/', async (req, res) => {
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
router.post('/updateProfile', async (req, res) => {
    const { userId, newProfileData } = req.body;
    const user = await database.models.users.findOne({ employeeId: userId });
    user.profile = newProfileData;
    await user.save();
    res.json({ message: 'Profile updated' });
});

/**
 * IDOR provides access to get user info based on a header
 */
router.get('/getUserData', async (req, res) => {
    const userId = parseInt(req.headers['x-user-id'], 10);
    const user = await database.models.users.findOne({ employeeId: userId });
    res.json({user});
});

/**
 * IDOR allows access to any file requested
 */
router.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);
    console.log(`filePath: ${filePath}`);
    res.sendFile(filePath);
});


module.exports = router;

