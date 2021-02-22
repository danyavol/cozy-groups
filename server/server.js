const express = require('express');
const app = express();
const port = 3080;

app.get('/', (req, res) => {
    res.send('App works!!');
});

app.get('/home', (req, res) => {
    res.send('Home');
});

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
})