const express = require('express');
const groups = express.Router();
module.exports = groups;

const authorizedOnly = require('../service/authorizedOnly.js');
const groupsCollection = require('../database/groups.js');
const {v4: uuidv4} = require('uuid');
const generateInviteCode = require('../service/inviteCode.js');

/*

POST: /groups/join
    { inviteCode: String }

POST: /groups/edit-info
    { groupId: String, name: String }

POST: /groups/update-invite-code
    { groupId: String }

POST: /groups/edit-role
    { groupId: String, userId: String, role: 'owner' / 'admin' / 'editor' / 'member' }
    
POST: /groups/kick-user
    { groupId: String, userId: String }

*/

groups.post('/create', authorizedOnly, async (req, res) => {
    let senderId = req.headers.authorization;
    let { name } = req.body;
    let response = {}
    console.log(senderId, name);
    if (!name) {
        res.status(400);
        response.ok = false;
        response.message = 'Введите название группы';
    } 
    // Создание группы
    else {
        let group = {
            id: uuidv4(),
            name: name,
            inviteCode: await generateInviteCode(),
            users: [
                { id: senderId, role: 'owner' }
            ]
        }
        await groupsCollection.insertGroup(group);

        res.status(200);
        response.ok = true;
        response.groupId = group.id;
        response.inviteCode = group.inviteCode;
        response.message = 'Группа успешно создана';
    }

    res.json(response);
});