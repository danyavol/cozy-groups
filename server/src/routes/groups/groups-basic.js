// cоздание группы
// присоединение к группе
// выход из группы
// получение информации о всех группах
// получение подробной информации о конкретной группе

const express = require('express');
const groups = express.Router();
module.exports = groups;

const generateCode = require('../../service/codeGenerator.js');
const Text = require('../../service/responseMessages.js');
const { sendResponse } = require('../../service/requestService.js');

const groupsCollection = require('../../database/database.js')('groups');
const usersCollection = require('../../database/database.js')('users');


groups.post('/create', async (req, res) => {
    let senderId = res.locals.userId;
    let { name } = req.body;
    
    if (!name) {
        return sendResponse(res, 400, Text.error.emptyGroupName);
    }
    else {
        let allGroups = await groupsCollection.find(null, true);
        
        let group = {
            id: generateCode(allGroups, 'id', 'group_id'),
            name: name,
            inviteCode: generateCode(allGroups, 'inviteCode', 'group_inviteCode'),
            users: [
                { id: senderId, role: 'owner' }
            ]
        }
      
        await groupsCollection.insertOne(group);

        let responseData = {
            group: {
                id: group.id,
                name: group.name,
                users_count: group.users.length
            }
        };
        return sendResponse(res, 200, Text.success.groupCreated, responseData);
    }
});


groups.post('/join', async (req, res) => {
    let senderId = res.locals.userId;
    let { inviteCode } = req.body;

    let group = await groupsCollection.find({inviteCode: inviteCode});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupByInviteCode);
    } 
    else {
        // Проверка, состоит ли пользователь уже в группе
        let alreadyMember = false;
        for (let i = 0; i < group.users.length; i++) {
            if (group.users[i].id == senderId) {
                alreadyMember = true;
                break;
            } 
        }

        if (alreadyMember) {
            return sendResponse(res, 400, Text.error.alreadyGroupMember);
        } 
        else {
            let userData = {
                id: senderId,
                role: 'member'
            };

            await groupsCollection.updateOne( {id: group.id}, {$push: {users: userData}} );
    
            let responseData = {
                group: {
                    id: group.id,
                    name: group.name,
                    users_count: group.users.length
                }
            };
            return sendResponse(res, 200, Text.success.userJoinedGroup, responseData);
        }
        
    }
});

groups.post('/leave', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.body;

    let group = await groupsCollection.find( {id: groupId} );
    let filteredUsers = group.users.filter(u => u.id === senderId);

    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    } 
    else if (!filteredUsers.length) {
        return sendResponse(res, 400, Text.error.notGroupMember);
    }
    else if ( filteredUsers[0].role === 'owner' ) {
        return sendResponse(res, 400, Text.error.ownerTryingToLeave);
    } 
    else {
        group.users = group.users.filter( u => u.id !== senderId );

        await groupsCollection.updateOne( {id: groupId}, {$set: {users: group.users}} )

        return sendResponse(res, 200, Text.success.userLeavedGroup);
    }
});


/** Получение основной информации о всех группах */
groups.get('/', async (req, res) => {
    let senderId = res.locals.userId;

    let groups = await groupsCollection.find( null, true );

    let outputGroups = [];
    for (let group of groups) {
        for (let user of group.users) {
            if (user.id === senderId) {
                outputGroups.push({
                    id: group.id,
                    name: group.name,
                    users_count: group.users.length
                });
            }
        }
    }

    return sendResponse(res, 200, null, {groups: outputGroups});
});


/** Получение информации о группе */
groups.get('/:id', async (req, res) => {
    let senderId = res.locals.userId;
    let groupId = req.params.id;

    let group = await groupsCollection.find( {id: groupId} );

    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    } 
    else {
        let memberData = group.users.filter(val => val.id == senderId)[0];

        if (!memberData) {
            return sendResponse(res, 400, Text.error.notGroupMember);
        } 
        else {
            // Удаление лишних полей
            delete group._id;
            if ( !['admin', 'owner'].includes(memberData.role) ) {
                delete group.inviteCode;
            }

            // Поиск подробной информации об участниках в коллекции users
            let membersId = group.users.map(val => val.id);
            let members = await usersCollection.find({id: {$in: membersId}}, true);

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

            return sendResponse(res, 200, null, {group: group});
        }
    }
});