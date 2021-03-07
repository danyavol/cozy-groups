// cоздание группы
// присоединение к группе
// выход из группы
// получение информации о всех группах
// получение подробной информации о конкретной группе

const express = require('express');
const groups = express.Router();
module.exports = groups;

const generateInviteCode = require('../../service/inviteCode.js');
const groupsCollection = require('../../database/groups.js');



groups.post('/create', async (req, res) => {
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


groups.post('/join', async (req, res) => {
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