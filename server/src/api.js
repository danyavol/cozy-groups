const express = require('express');
const api = express.Router();
module.exports = api;

const { getUser, saveUser, loginUser, registerUser } = require('./database/users.js');


api.post('/login', async (req, res) => {
    let {password, login} = req.query;
    let response = {};

    // Проверка логина
    if (!login) {
        response.ok = false;
        response.error = 'Введите логин';
    } 
    // Проверка пароля
    else if (!password) {
        response.ok = false;
        response.error = 'Введите пароль';
    } 
    // Попытка авторизации
    else {
        let result = await loginUser(login, password);
        if (result.ok) {
            response.ok = true;
            response.user = result.user;
        } else {
            response.ok = false;
            response.error = 'Неверный пароль'
        }
    }

    res.json(response);
});

api.post('/register', async (req, res) => {
    let {password, login} = req.query;
    const pass_Regexp = /[A-Za-z0-9!@#$%^&*]{4,20}/;
    const login_Regexp = /[A-Za-z0-9]{4,20}/;
    let response = {};

    if (!login) {
        response.ok = false;
        response.error = 'Введите логин';
    } else if (!password) {
        response.ok = false;
        response.error = 'Введите пароль';
    } else if (!pass_Regexp.test(password)) {
        console.log(password);
        response.ok = false;
        response.error = 'Неверный формат пароля';
    } else if (!login_Regexp.test(login)) {
        response.ok = false;
        response.error = 'Неверный формат логина';
    } else {
        // Поиск такого логина в БД
        let user = await getUser(login);
        if (!user) {
            let result = await registerUser(login, password);
            response.ok = true;
            // Сохранение пользователя в БД
            // ...
        } else {
            response.ok = false;
            response.error = 'Логин занят';
        }
    }

    res.json(response);
});