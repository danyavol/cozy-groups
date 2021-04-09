const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;

module.exports = function (collectionName) { 
    return {
        dbParams: {useUnifiedTopology: true},

        collectionName: collectionName,

        // Получить одну, несколько или все объекты
        async find(query, findMany=false) {
            const client = new MongoClient(uri, this.dbParams);
            let objects;
            try {
                await client.connect();
                const collection = client.db("cozydata").collection(this.collectionName);

                if (findMany) {
                    objects = await collection.find(query).toArray();
                } else {
                    objects = await collection.findOne(query);
                }  
        
            } finally {
                await client.close();
            }
            return objects;
        },

        // Создать объект
        async insertOne(object) {
            const client = new MongoClient(uri, this.dbParams);
            let result;
            try {
                await client.connect();
                const collection = client.db("cozydata").collection(this.collectionName);
        
                result = await collection.insertOne(object);
        
            } finally {
                await client.close();
            }
            return result;
        },

        // Обновить объект
        async updateOne(filter, object) {
            const client = new MongoClient(uri, this.dbParams);
            let result;
            try {
                await client.connect();
                const collection = client.db("cozydata").collection(this.collectionName);
        
                result = await collection.updateOne(filter, object);
        
            } finally {
                await client.close();
            }
            return result;
        },
        
        // Удалить объект
        async deleteOne(query) {
            const client = new MongoClient(uri, this.dbParams);
            let result;
            try {
                await client.connect();
                const collection = client.db("cozydata").collection(this.collectionName);
        
                result = await collection.deleteOne(query);
        
            } finally {
                await client.close();
            }
            return result;
        }
    }
};