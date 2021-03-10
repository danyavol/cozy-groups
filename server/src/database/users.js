const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};

module.exports = {
    findUser: async (query, findMany=false) => {
        const client = new MongoClient(uri, dbParams);
        let user;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("users");

            if (findMany) {
                user = await collection.find(query).toArray();
            } else {
                user = await collection.findOne(query);
            }  

        } finally {
            await client.close();
        }
        return user;
    },

    insertUser: async (userData) => {
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
    },

    // Обновить группу
    updateUser: async (filter, data) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("users");
    
            result = await collection.updateOne(filter, data);
    
        } finally {
            await client.close();
        }
        return result;
    }
};