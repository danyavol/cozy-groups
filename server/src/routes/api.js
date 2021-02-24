const express = require('express');
const api = express.Router();
module.exports = api;

const { getUser, saveUser, loginUser, registerUser } = require('../database/users.js');
const { userDTO } = require('../dto.js');


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
            response.user = userDTO(result.user);
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
    } else if (!login_Regexp.test(login)) {
        response.ok = false;
        response.error = 'Неверный формат логина';
    } else if (!pass_Regexp.test(password)) {
        response.ok = false;
        response.error = 'Неверный формат пароля';
    } else {
        // Поиск такого логина в БД
        let user = await getUser(login);
        if (!user) {
            // Регистрация
            let result = await registerUser(login, password);
            response.ok = result.ok;
            if (result.ok) response.user = userDTO(result.user);
        } else {
            response.ok = false;
            response.error = 'Логин занят';
        }
    }

    res.json(response);
});