const express = require('express');
const posts = express.Router();
module.exports = posts;

// Запросы для обычных пользователей
posts.use('/', require('./member-req.js'));

// Запросы для редактора
posts.use('/', require('./editor-req.js'));


