const express = require('express');
const groups = express.Router();
module.exports = groups;

// Базовый функционал групп
groups.use('/', require('./groups-basic.js'));

// Запросы, доступные участнику
groups.use('/', require('./member-req.js'));

// Запросы, доступные редактору
groups.use('/', require('./editor-req.js'));

// Запросы, доступные администратору
groups.use('/', require('./admin-req.js'));

// Запросы, доступные владельцу
groups.use('/', require('./owner-req.js'));


// P.S. Права ролей указаны в файле permissions.js. Разделение на файлы здесь - лишь для удобства.