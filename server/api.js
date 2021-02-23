const express = require('express');
const api = express.Router();

module.exports = api;

api.post('/login', (req, res) => {
    console.log(req.query);
    res.json(req.query);
});

api.post('/register', (req, res) => {
    console.log(req.query);
    res.json(req.query);
});