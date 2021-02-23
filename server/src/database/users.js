const { MongoClient } = require("mongodb");
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

module.exports.loginUser = async (login, password) => {
    const client = new MongoClient(uri, dbParams);
    let response = {};
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

        delete response.user.password;
        delete response.user._id;

    } finally {
        await client.close();
    }
    return response;
};

module.exports.registerUser = async (login, password) => {
    const client = new MongoClient(uri, dbParams);
    let result;
    try {
        await client.connect();
        const collection = client.db("cozydata").collection("users");
        
        result = await collection.insertOne({login: login, password: password});

        console.log(result);

    } finally {
        await client.close();
    }
    return result;
};