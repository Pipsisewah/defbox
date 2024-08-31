const mongoose = require('mongoose');
const database = {};
database.models = {};

const mongoUrl = 'mongodb://defboxlocalmongodb:27017';

// Sample in-memory database
const users = [
    { id: 1, name: 'Alice', role: 'admin', secret: 'Admin Secret', employeeId: 1 },
    { id: 2, name: 'Bob', role: 'user', secret: 'User Secret', employeeId: 2 },
    { id: 3, name: 'Kari', role: 'user', secret: 'Manager Secret', employeeId: 3 },
];

// Define a schema and model (example)
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    secret: String,
    employeeId: Number,
    profile: Object
});

const User = mongoose.model('User', userSchema);
database.models.users = User;


database.populate = async () => {
    try {
        // Check if the collection is already populated
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Insert users if the collection is empty
            await User.insertMany(users);
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



