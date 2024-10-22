const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');


const uri = 'mongodb://localhost:27017/'; 
const dbName = 'mydatabase'; 


const dbConnection = async () => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to the database");
        const db = client.db(dbName);
        return db;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
};


app.get('/req', async (req, res) => {
    try {
        const db = await dbConnection();
        const collection = db.collection('users');
        
        
        const users = await collection.find().toArray();


        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }

    
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
