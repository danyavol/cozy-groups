const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};

module.exports.getUser = async (login) => {
    const client = new MongoClient(uri, dbParams);
    let user;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("users");

        user = await collection.findOne({login: login});
    } finally {
        await client.close();
    }
    return user;
};

module.exports.registerUser = async (userData) => {
    const client = new MongoClient(uri, dbParams);
    let response = null;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("users");
        
        let result = await collection.insertOne(userData);

        if (result.result.ok) {
            userData._id = result.insertedId;
            response = userData;
        }
        
    } finally {
        await client.close();
    }
    return response;
};