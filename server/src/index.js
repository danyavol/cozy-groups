const express = require('express');
const router = express.Router();
module.exports = router;


const { getToken } = require('./database/tokens.js');

// Доступ к ресурсам, имеющим этот middleware, могут получить толька авторизованные пользователи
const authorizedOnly = async function (req, res, next) {
    let token = await getToken(req.headers.authorization);

    if (!token) {
        let error = new Error('Для доступа требуется аутентификация');
        error.status = 401;
        next(error);
    } else {
        next();
    }
}

// Авторизация
router.use('/auth', require('./routes/auth.js'));

// Управление группами
router.use('/groups', require('./routes/groups.js'));


router.get('/secret', authorizedOnly, (req, res) => {
    res.json('Secret page. Ганс девочка');    
});