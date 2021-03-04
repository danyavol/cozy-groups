const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};

module.exports = {
    findToken: async (query) => {
        const client = new MongoClient(uri, dbParams);
        let token;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("tokens");
            
            if (query)
                token = await collection.findOne(query);
            else 
                token = await collection.find();
        } finally {
            await client.close();
        }
        return token;
    },

    insertToken: async (data) => {
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
    },

    deleteToken: async (query) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("tokens");
            
            result = await collection.deleteMany(query);
        } finally {
            await client.close();
        }
        return result;
    }
};