const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};

module.exports.getToken = async (userToken) => {
    const client = new MongoClient(uri, dbParams);
    let token;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("tokens");
        
        token = await collection.findOne({token: userToken});
    } finally {
        await client.close();
    }
    return token;
};

module.exports.addToken = async (data) => {
    const client = new MongoClient(uri, dbParams);
    let result;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("tokens");
        
        result = await collection.insertOne(data);
    } finally {
        await client.close();
    }
    return result;
};

module.exports.deleteAllTokens = async (userLogin) => {
    const client = new MongoClient(uri, dbParams);
    let result;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("tokens");
        
        result = await collection.deleteMany({login: userLogin});
    } finally {
        await client.close();
    }
    return result;
};