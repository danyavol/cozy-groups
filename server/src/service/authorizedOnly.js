const tokensCollection = require('../database/tokens.js');

// Доступ к ресурсам, имеющим этот middleware, могут получить толька авторизованные пользователи
module.exports = async function authorizedOnly(req, res, next) {
    let token = await tokensCollection.findToken({token: req.headers.authorization});

    if (!token) {
        let error = new Error('Для доступа требуется аутентификация');
        error.status = 401;
        next(error);
    } else {
        next();
    }
}