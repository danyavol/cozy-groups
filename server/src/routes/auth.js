const express = require('express');
const auth = express.Router();
module.exports = auth;


const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const { deleteAllTokens, addToken } = require('../database/tokens.js');
const { getUser, registerUser } = require('../database/users.js');

function isValidPassword(presentedPassword, userPassword) {
    return bcrypt.compareSync(presentedPassword, userPassword);
}


auth.post('/register', async (req, res, next) => {
    let { password, login, firstName, lastName } = req.body;
    const pass_Regexp = /[A-Za-z0-9!@#$%^&*]{4,20}/;
    const login_Regexp = /[A-Za-z0-9]{4,20}/;
    const name_Regexp = /^([A-Za-z]+|[А-Яа-я]+)$/;
    let response = {};

    if (!login) {
        res.status(400);
        response.ok = false;
        response.message = 'Введите логин';
    } else if (!password) {
        res.status(400);
        response.ok = false;
        response.message = 'Введите пароль';
    } else if (!firstName) {
        res.status(400);
        response.ok = false;
        response.message = 'Введите имя';
    } else if (!login_Regexp.test(login)) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверный формат логина';
    } else if (!pass_Regexp.test(password)) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверный формат пароля';
    } else if (!name_Regexp.test(firstName)) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверный формат имени';
    } else if (lastName && !name_Regexp.test(lastName)) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверный формат фамилии';
    } else {
        // Поиск такого логина в БД
        let user = await getUser(login);
        if (!user) {
            // Регистрация
            user = {
                id: uuidv4(),
                login: login,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                firstName: capitalize(firstName),
                lastName: capitalize(lastName)
            }
            let savedUser = await registerUser(user);

            if (savedUser) {
                let token = uuidv4();
                await addToken({login: login, token: token});

                res.status(200);
                response.ok = true;
                response.message = 'Пользователь успешно зарегистрирован'
                response.token = token;
            }
        } else {
            res.status(400);
            response.ok = false;
            response.message = 'Логин занят';
        }
    }

    res.json(response);
});

auth.post('/login', async (req, res, next) => {
    let {password, login} = req.body;
    let response = {};

    // Проверка логина
    if (!login) {
        res.status(400);
        response.ok = false;
        response.error = 'Введите логин';
    } 
    // Проверка пароля
    else if (!password) {
        res.status(400);
        response.ok = false;
        response.error = 'Введите пароль';
    } 
    // Попытка авторизации
    else {
        let user = await getUser(login);
        if (!user) {
            // Пользователь не найден
            res.status(400);
            response.ok = false;
            response.message = 'Логин не найден';
        } else {
            if ( isValidPassword(password, user.password) ) {
                // Пароль верный
                let data = {
                    login: login,
                    token: uuidv4(),
                    'user-agent': req.headers['user-agent']
                };
                
                await deleteAllTokens(login);
                await addToken(data);
    
                res.status(200);
                response.ok = true;
                response.message = 'Успешно авторизован';
                response.token = data.token;
            } else {
                // Неверный пароль
                res.status(400);
                response.ok = false;
                response.message = 'Неверный пароль';
            }
        }
    }

    res.json(response);
});

function capitalize(string) {
    return string ? string[0].toUpperCase() + string.toLowerCase().slice(1) : string;
}