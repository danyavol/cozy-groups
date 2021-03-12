const maxTokenAge = 1000 * 60 * 60 * 24; // 24 часа

const tokensCollection = require('../database/tokens.js');
const {v4: uuidv4} = require('uuid');

module.exports = async function createToken(userId) {
    const tokenData = {
        userId: userId,
        token: 'token-' + uuidv4(),
        maxAge: Date.now() + maxTokenAge,
        'user-agent': req.headers['user-agent']   
    }

    await tokensCollection.insertToken(tokenData);

    return tokenData.token;
}