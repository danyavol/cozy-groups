const express = require('express');
const groups = express.Router();
module.exports = groups;

const authorizedOnly = require('../service/authorizedOnly.js');
const groupsCollection = require('../database/groups.js');
const {v4: uuidv4} = require('uuid');
const generateInviteCode = require('../service/inviteCode.js');
const permissions = require('../service/permissions.js');

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

groups.post('/edit-role', authorizedOnly, async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId, newRole } = req.body;
    let response = {};

    if ( !['member', 'editor', 'admin', 'owner'].includes(newRole) ) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверное название роли. Доступные роли: member, editor, admin, owner.';
        return res.json(response);
    } else if (senderId == userId) {
        res.status(400);
        response.ok = false;
        response.message = 'Нельзя изменить права самому себе';
        return res.json(response);
    }

    // #1 Поиск группы
    let group = await groupsCollection.findGroup({id: groupId});
    if (!group) {
        res.status(400);
        response.ok = false;
        response.message = 'Неверный id группы';
    } else {
        // #2 Поиск отправителя и получателя в группе, определение их ролей
        let senderRole = null;
        let recipientRole = null;
        for (let user of group.users) {
            if (user.id == senderId) {
                senderRole = user.role;
            } else if (user.id == userId) {
                recipientRole = user.role
            }
        }

        if (!senderRole) {
            res.status(400);
            response.ok = false;
            response.message = 'Вы не состоите в данной группе';
        } else if (!recipientRole) {
            res.status(400);
            response.ok = false;
            response.message = 'Запрашиваемый пользователь не состоит в группе';
        } else if (recipientRole == newRole) {
            res.status(400);
            response.ok = false;
            response.message = 'Пользователь уже имеет такие права';
        } else {
            // #3 Определение имеет ли отправитель право на данное действие
            let permission = recipientRole + '-set-' + newRole;

            if ( !permissions[senderRole].includes(permission) ) {
                res.status(400);
                response.ok = false;
                response.message = 'У вас недостаточно прав для данного действия';
            } else {
                // Проверки пройдены, изменяем права пользователя
                for (let user of group.users) {
                    if (user.id == userId) {
                        user.role = newRole;
                    }
                }

                await groupsCollection.updateGroup({id: groupId}, {$set: {users: group.users}});

                res.status(200);
                response.ok = true;
                response.message = 'Права пользователя успешно изменены';
            }
        }
    }

    res.json(response);
});