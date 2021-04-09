const maxTokenAge = 1000 * 60 * 60 * 24; // 24 часа

const {v4: uuidv4} = require('uuid');

const tokensCollection = require('../database/database.js')('tokens');


async function createToken(userId, req) {
    const tokenData = {
        userId: userId,
        token: 'token-' + uuidv4(),
        maxAge: Date.now() + maxTokenAge,
        'user-agent': req.headers['user-agent']   
    }

    await tokensCollection.insertOne(tokenData);

    return tokenData.token;
}

async function deleteToken(token) {
    await tokensCollection.deleteOne({token: token});
}

module.exports.createToken = createToken; 
module.exports.deleteToken = deleteToken;