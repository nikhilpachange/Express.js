const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017/';
const client = new MongoClient(url);
const dbName = 'mydatabase';

let db; 

const dbConnection = async () => {
    try {
        
        if (!db) {
            await client.connect();
            console.log('Connected to the database');
            db = client.db(dbName);
        }
        return db;
    } catch (error) {
        console.log('Failed to connect to the database:', error);
        throw error;
    }
};


process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

module.exports = { dbConnection };
