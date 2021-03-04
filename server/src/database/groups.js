const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};


module.exports = {
    // Получить одну или все группы
    findGroup: async (query) => {
        const client = new MongoClient(uri, dbParams);
        let group;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("groups");
    
            if (query)
                group = await collection.findOne(query);
            else 
                group = await collection.find();
    
        } finally {
            await client.close();
        }
        return group;
    },

    // Создать группу
    insertGroup: async (group) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("groups");
    
            result = await collection.insertOne(group);
    
        } finally {
            await client.close();
        }
        return result;
    },

    // Обновить группу
    updateGroup: async (filter, group) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("groups");
    
            result = await collection.updateOne(filter, group);
    
        } finally {
            await client.close();
        }
        return result;
    }
};