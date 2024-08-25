const mongoose = require('mongoose');
const database = {};
database.models = {};

const mongoUrl = 'mongodb://defboxlocalmongodb:27017';

// Sample in-memory database
const users = [
    { id: 1, name: 'Alice', role: 'admin', secret: 'Admin Secret', employeeId: 1, companyId: 1 },
    { id: 2, name: 'Bob', role: 'user', secret: 'User Secret', employeeId: 2, companyId: 2 },
    { id: 3, name: 'Kari', role: 'user', secret: 'Manager Secret', employeeId: 3, companyId: 1 },
];

const authTokens = [
    { employeeId: 1, token: 'authToken1' },
    { employeeId: 2, token: 'authToken2' },
    { employeeId: 3, token: 'authToken3' },
];

const files = [
    { fileName: 'firstFile', companyId: 1},
    { fileName: 'secondFile', companyId: 2},
    { fileName: 'thirdFile', companyId: 1},
    { fileName: 'secret.txt', companyId: 1},

];

// Define a schema and model (example)
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    secret: String,
    employeeId: Number,
    profile: Object,
    companyId: Number
});

const authTokenSchema = new mongoose.Schema({
    employeeId: Number,
    token: String,
});

const fileSchema = new mongoose.Schema({
    fileName: String,
    companyId: Number,
});

const User = mongoose.model('User', userSchema);
const AuthToken = mongoose.model('AuthToken', authTokenSchema);
const File = mongoose.model('File', fileSchema);
database.models.users = User;
database.models.authTokens = AuthToken;
database.models.files = File;


database.populate = async () => {
    try {
        // Check if the collection is already populated
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Insert users if the collection is empty
            await User.insertMany(users);
            await AuthToken.insertMany(authTokens);
            await File.insertMany(files);
            console.log('Database populated with initial data.');
        } else {
            console.log('Database already populated. Skipping population.');
        }
    } catch (error) {
        console.error('Error populating database:', error);
    }
}


database.connect = async () => {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    database.connection = mongoose.connection;

    database.connection.on('error', console.error.bind(console, 'connection error:'));
    database.connection.once('open', async () => {
        console.log('Connected to MongoDB');
    });
}

module.exports = database;



