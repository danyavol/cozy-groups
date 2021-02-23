const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};

const {v4: uuidv4} = require('uuid');

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

module.exports.loginUser = async (login, password) => {
    const client = new MongoClient(uri, dbParams);
    let response = {ok: false};
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("users");
        
        let user = await collection.findOne({login: login});

        if (!user) {
            // User not found
            response.ok = false;
        } else if (user.password != password) {
            // Wrong password
            response.ok = false;
        } else {
            response.ok = true;
            response.user = user;
        }

    } finally {
        await client.close();
    }
    return response;
};

module.exports.registerUser = async (login, password) => {
    const client = new MongoClient(uri, dbParams);
    let response = {ok: false};
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("users");

        let user = {
            id: uuidv4(),
            login: login,
            password: password
        }
        
        let result = await collection.insertOne(user);

        if (result.result.ok) {
            response.ok = true;
            response.user = user;
        } else {
            response.ok = false;
        }
        
    } finally {
        await client.close();
    }
    return response;
};