const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};


module.exports = {
    // Получить одну, несколько или все группы
    findGroup: async (query, findMany=false) => {
        const client = new MongoClient(uri, dbParams);
        let group;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("groups");

            if (findMany) {
                group = await collection.find(query).toArray();
            } else {
                group = await collection.findOne(query);
            }  
    
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
    },
    
    deleteGroup: async (query) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("groups");
    
            result = await collection.deleteOne(query);
    
        } finally {
            await client.close();
        }
        return result;
    }
};