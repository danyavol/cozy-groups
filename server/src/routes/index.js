const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');

const { getToken, deleteAllTokens, addToken } = require('../database/tokens');
const { getUser, registerUser, loginUser } = require('../database/users');
const { userDTO } = require('../dto');


const auth = async function (req, res, next) {
    let token = await getToken(req.headers.authorization);

    console.log('Auth required. Current token:', req.headers.authorization);

    if (!token) {
        let error = new Error('Не авторизован!');
        error.status = 401;
        next(error);
    } else {
        next();
    }
}

function isValidPassword(presentedPassword, userPassword) {
    return bcrypt.compareSync(presentedPassword, userPassword);
}


router.post('/register', async (req, res, next) => {
    let { password, login } = req.body;
    const pass_Regexp = /[A-Za-z0-9!@#$%^&*]{4,20}/;
    const login_Regexp = /[A-Za-z0-9]{4,20}/;
    let response = {};

    if (!login) {
        response.ok = false;
        response.message = 'Введите логин';
    } else if (!password) {
        response.ok = false;
        response.message = 'Введите пароль';
    } else if (!login_Regexp.test(login)) {
        response.ok = false;
        response.message = 'Неверный формат логина';
    } else if (!pass_Regexp.test(password)) {
        response.ok = false;
        response.message = 'Неверный формат пароля';
    } else {
        // Поиск такого логина в БД
        let user = await getUser(login);
        if (!user) {
            // Регистрация
            user = {
                id: uuidv4(),
                login: login,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            }
            let savedUser = await registerUser(user);

            if (savedUser) {
                let token = uuidv4();
                await addToken({login: login, token: token});
                
                response.ok = true;
                response.message = 'Пользователь успешно зарегистрирован'
                response.token = token;
            }
        } else {
            response.ok = false;
            response.message = 'Логин занят';
        }
    }

    res.json(response);
});

router.post('/login', async (req, res, next) => {
    let {password, login} = req.body;
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
        let user = await getUser(login);
        if (!user) {
            // Пользователь не найден
            response.ok = false;
            response.message = 'Логин не найден';
        } else {
            if ( isValidPassword(password, user.password) ) {
                // Пароль верный
                let data = {
                    login: login,
                    token: uuidv4()
                };
                
                await deleteAllTokens(login);
                await addToken(data);
    
                response.ok = true;
                response.message = 'Успешно авторизован';
                response.token = data.token;
            } else {
                // Неверный пароль
                response.ok = false;
                response.message = 'Неверный пароль';
            }
        }
    }

    res.json(response);
});


router.get('/secret', auth, (req, res) => {
    res.json('Secret page');    
});


module.exports = router;