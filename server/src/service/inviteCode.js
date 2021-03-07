const codeLength = 6;
const groupsCollection = require('../database/groups.js');

module.exports = async function generateInviteCode() {
    let groups = await groupsCollection.findGroup(null, true);
    let existingCodes = [];
    groups.map(group => existingCodes.push(group.inviteCode));

    let code;
    do {
        code = randomCode();
    } while (existingCodes.includes(code));

    return code;
}

function randomCode() {
    let result           = '';
    let characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}