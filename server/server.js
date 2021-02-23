require('dotenv').config()

const express = require('express');
const app = express();
const port = 3080;

const api = require('./api.js');


const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB_URI);


app.use('/api', api);


app.get('/', (req, res) => {
    res.send('App works!!');
});


app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
});