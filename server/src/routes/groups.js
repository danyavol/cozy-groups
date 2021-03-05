const express = require('express');
const groups = express.Router();
module.exports = groups;

const authorizedOnly = require('../service/authorizedOnly.js');
const groupsCollection = require('../database/groups.js');
const {v4: uuidv4} = require('uuid');
const generateInviteCode = require('../service/inviteCode.js');

/*

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
    let senderId = res.locals.userId;
    let { name } = req.body;
    let response = {}
    
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

groups.post('/join', authorizedOnly, async (req, res) => {
    let senderId = res.locals.userId;
    let { inviteCode } = req.body;
    let response = {};

    let group = await groupsCollection.findGroup({inviteCode: inviteCode});
    if (!group) {
        res.status(400);
        response.ok = false;
        response.message = 'Группа с таким кодом приглашения не найдена'
    } else {
        // Проверка, состоит ли пользователь уже в группе
        let alreadyMember = false;
        for (let i = 0; i < group.users.length; i++) {
            if (group.users[i].id == senderId) {
                alreadyMember = true;
                break;
            } 
        }

        if (alreadyMember) {
            res.status(400);
            response.ok = false;
            response.message = 'Вы уже состоите в этой группе';
        } else {
            let userData = {
                id: senderId,
                role: 'member'
            };
            await groupsCollection.updateGroup( {id: group.id}, {$push: {users: userData}} );
    
            res.status(200);
            response.ok = true;
            response.message = 'Вы успешно присоединились к группе';
        }
        
    }

    res.json(response);
});