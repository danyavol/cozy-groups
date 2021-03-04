const express = require('express');
const router = express.Router();
module.exports = router;

const authorizedOnly = require('./service/authorizedOnly.js');


// Авторизация
router.use('/auth', require('./routes/auth.js'));

// Управление группами
router.use('/groups', require('./routes/groups.js'));


router.get('/secret', authorizedOnly, (req, res) => {
    res.json('Secret page. Ганс девочка');    
});