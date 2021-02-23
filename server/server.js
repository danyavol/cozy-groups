require('dotenv').config();

const express = require('express');
const app = express();
const port = 3080;


const api = require('./src/api.js');
app.use('/api', api);


app.get('/', (req, res) => {
    res.send('Main page');
});


app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
});