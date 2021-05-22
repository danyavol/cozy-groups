const express = require('express');
const auth = express.Router();
module.exports = auth;


const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');
const { createToken, deleteToken } = require('../../service/createToken.js');
const authorizedOnly = require('../../service/authorizedOnly.js');
const Validator = require('../../service/validator.js');
const { sendResponse } = require('../../service/requestService.js');
const Text = require('../../service/responseMessages.js');

const usersCollection = require('../../database/database.js')('users');

function isValidPassword(presentedPassword, userPassword) {
    return bcrypt.compareSync(presentedPassword, userPassword);
}


auth.post('/register', async (req, res) => {
    let { password, login, firstName, lastName, infiniteToken } = req.body;

    if ( !Validator.login(login) ) {
        return sendResponse(res, 400, Text.error.validation.login);
    } 
    else if ( !Validator.password(password) ) {
        return sendResponse(res, 400, Text.error.validation.password);
    } 
    else if ( !Validator.userName(firstName) ) {
        return sendResponse(res, 400, Text.error.validation.firstName);
    } 
    else if (lastName && !Validator.userName(lastName)) {
        return sendResponse(res, 400, Text.error.validation.lastName);
    } 
    else {
        // Поиск такого логина в БД
        let user = await usersCollection.find({login: login});

        if (user) {
            return sendResponse(res, 400, Text.error.loginAlreadyTaken);
        } 
        else {
            // Регистрация
            user = {
                id: 'user-' + uuidv4(),
                login: login,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                firstName: capitalize(firstName),
                lastName: capitalize(lastName)
            }

            await usersCollection.insertOne(user);
            
            let token = await createToken(user.id, req, infiniteToken);
            delete user.password;
            delete user._id;

            return sendResponse(res, 200, Text.success.userCreated, {token: token, user: user});
        }
    }
});

auth.post('/login', async (req, res) => {
    let {password, login, infiniteToken} = req.body;

    // Проверка логина
    if (!login) {
        return sendResponse(res, 400, Text.error.emptyLogin);
    } 
    // Проверка пароля
    else if (!password) {
        return sendResponse(res, 400, Text.error.emptyPassword);
    } 
    // Попытка авторизации
    else {
        let user = await usersCollection.find({login: login});
        if (!user) {
            // Пользователь не найден
            return sendResponse(res, 400, Text.error.findUserByLogin);
        } 
        else {
            if ( !isValidPassword(password, user.password) ) {
                // Неверный пароль
                return sendResponse(res, 400, Text.error.wrongPassword);
            } 
            else {
                // Пароль верный
                let token = await createToken(user.id, req, infiniteToken);
                delete user.password;
                delete user._id;
                return sendResponse(res, 200, Text.success.userAuthorized, {token: token, user: user});
            }
        }
    }
});

auth.delete('/logout', authorizedOnly, async (req, res) => {
    await deleteToken(res.locals.token);

    return sendResponse(res, 200, Text.success.tokenDeleted);
});

function capitalize(string) {
    return string ? string[0].toUpperCase() + string.toLowerCase().slice(1) : null;
}