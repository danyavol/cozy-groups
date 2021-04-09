const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
const dbParams = {useUnifiedTopology: true};


module.exports = {
    // Получить одну, несколько или все записи группы
    findPost: async (query, findMany=false) => {
        const client = new MongoClient(uri, dbParams);
        let posts;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("posts");

            if (findMany) {
                posts = await collection.find(query).toArray();
            } else {
                posts = await collection.findOne(query);
            }  
    
        } finally {
            await client.close();
        }
        return posts;
    },

    // Создать пост
    insertPost: async (post) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("posts");
    
            result = await collection.insertOne(post);
    
        } finally {
            await client.close();
        }
        return result;
    },

    // Обновить пост
    updatePost: async (filter, post) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("posts");
    
            result = await collection.updateOne(filter, post);
    
        } finally {
            await client.close();
        }
        return result;
    },
    
    deletePost: async (query) => {
        const client = new MongoClient(uri, dbParams);
        let result;
        try {
            await client.connect();
            const collection = client.db("cozydata").collection("posts");
    
            result = await collection.deleteOne(query);
    
        } finally {
            await client.close();
        }
        return result;
    }
};