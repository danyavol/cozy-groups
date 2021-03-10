// cоздание группы
// присоединение к группе
// выход из группы
// получение информации о всех группах
// получение подробной информации о конкретной группе

const express = require('express');
const groups = express.Router();
module.exports = groups;

const generateCode = require('../../service/codeGenerator.js');
const groupsCollection = require('../../database/groups.js');
const usersCollection = require('../../database/users.js');
const {v4: uuidv4} = require('uuid');


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
        let allGroups = await groupsCollection.findGroup(null, true);
        
        let group = {
            id: generateCode(allGroups, 'id'),
            name: name,
            inviteCode: generateCode(allGroups, 'inviteCode'),
            users: [
                { id: senderId, role: 'owner' }
            ]
        }

        await Promise.all([
            groupsCollection.insertGroup(group),
            usersCollection.updateUser( {id: senderId}, {$push: {groups: group.id}} )
        ]);

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

            await Promise.all([
                groupsCollection.updateGroup( {id: group.id}, {$push: {users: userData}} ),
                usersCollection.updateUser( {id: senderId}, {$push: {groups: group.id}} )
            ]);
    
            res.status(200);
            response.ok = true;
            response.message = 'Вы успешно присоединились к группе';
        }
        
    }

    res.json(response);
});

groups.post('/leave', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.body;
    let response = {};

    let group, userData;
    await Promise.all([
        groupsCollection.findGroup( {id: groupId} ),
        usersCollection.findUser( {id: senderId} )
    ]).then(result => { group = result[0]; userData = result[1] });

    if (!group) {
        res.status(400);
        response.ok = false;
        response.message = 'Группа не найдена';
    } else if (!userData.groups.includes(groupId)) {
        res.status(400);
        response.ok = false;
        response.message = 'Вы не состоите в этой группе';
    } else if ( group.users.filter(val => val.id == senderId)[0].role == 'owner' ) {
        res.status(400);
        response.ok = false;
        response.message = 'Нельзя выйти из группы являясь ее владельцем. Сперва передайте свои права другому участнику';
    } else {
        group.users = group.users.filter( val => val.id == senderId ? false : true );

        await Promise.all([
            usersCollection.updateUser( {id: senderId}, {$pull: {groups: groupId}} ),
            groupsCollection.updateGroup( {id: groupId}, {$set: {users: group.users}} )
        ]);

        res.status(200);
        response.ok = true;
        response.message = 'Вы успешно вышли из группы';
    }

    res.json(response);
});


/** Получение основной информации о всех группах */
groups.get('/', async (req, res) => {
    let senderId = res.locals.userId;
    let response = {};

    let user = await usersCollection.findUser( {id: senderId} );
    let groups = await groupsCollection.findGroup( {id: {$in: user.groups || []}}, true );

    let outputGroups = [];
    for (let group of groups) {
        outputGroups.push({
            id: group.id,
            name: group.name,
        });
    }

    res.status(200);
    response.ok = true;
    response.groups = outputGroups;

    res.json(response);
});

/** Получение информации о группе */
groups.get('/:id', async (req, res) => {
    let senderId = res.locals.userId;
    let groupId = req.params.id;
    let response = {};

    let group = await groupsCollection.findGroup( {id: groupId} );

    if (!group) {
        res.status(400);
        response.ok = false;
        response.message = 'Группа с таким id не найдена';
    } else {
        let memberData = group.users.filter(val => val.id == senderId)[0];

        if (!memberData) {
            res.status(400);
            response.ok = false;
            response.message = 'Вы не являетесь участником этой группы';
        } else {
            // Удаление лишних полей
            delete group._id;
            if ( !['admin', 'owner'].includes(memberData.role) ) {
                delete group.inviteCode;
            }

            // Поиск подробной информации об участниках в коллекции users
            let membersId = group.users.map(val => val.id);
            let members = await usersCollection.findUser({id: {$in: membersId}}, true);

            // Добавление в объект group подробных данных участников
            for (let groupUser of group.users) {
                for (let member of members) {
                    if (groupUser.id == member.id) {
                        groupUser.login = member.login;
                        groupUser.firstName = member.firstName;
                        groupUser.lastName = member.lastName;
                        break;
                    }
                }
            }

            res.status(200);
            response.ok = true;
            response.group = group;
        }
    }

    res.json(response);
});