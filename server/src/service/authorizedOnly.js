const tokensCollection = require('../database/tokens.js');

// Доступ к ресурсам, имеющим этот middleware, могут получить толька авторизованные пользователи
module.exports = async function authorizedOnly(req, res, next) {
    let tokenData = await tokensCollection.findToken({token: req.headers.authorization});

    if (!tokenData) {
        // Неверный токен
        let error = new Error('Ошибка аутентификации');
        error.status = 401;
        next(error);
    } else {
        if (tokenData.maxAge < Date.now()) {
            // Срок жизни токена истек
            await tokensCollection.deleteToken({token: tokenData.token});
            let error = new Error('Данный токен больше недействителен');
            error.status = 401;
            next(error);
        } else {
            // Успешно авторизован
            res.locals.userId = tokenData.userId;
            res.locals.token = tokenData.token;
            next();
        }
    }
}