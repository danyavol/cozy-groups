// Кикнуть
// Изменить информацию о группе
// Обновить код приглашения

const express = require('express');
const groups = express.Router();
module.exports = groups;

const permissions = require('../../service/permissions.js');
const generateCode = require('../../service/codeGenerator.js');
const Text = require('../../service/responseMessages.js')
const { sendResponse } = require('../../service/requestService.js');
const Validator = require('../../service/validator.js');

const groupsCollection = require('../../database/database.js')('groups');


groups.put('/invite-code', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.body;

    let group = await groupsCollection.find({id: groupId});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    }

    let senderRole;
    for (let user of group.users) {
        if (user.id == senderId) {
            senderRole = user.role;
        }
    }

    if (!senderRole) {
        return sendResponse(res, 400, Text.error.notGroupMember);
    } 
    else if (!permissions[senderRole].includes('updateInviteCode')) {
        return sendResponse(res, 400, Text.error.permissionDenied)
    } 
    else {
        let allGroups = await groupsCollection.find(null, true);
        
        let inviteCode = generateCode(allGroups, 'inviteCode');

        groupsCollection.updateOne({id: groupId}, {$set: {inviteCode: inviteCode}})
        
        return sendResponse(res, 200, null, {inviteCode: inviteCode});
    }
});

groups.delete('/kick-user', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId } = req.body;

    let group = await groupsCollection.find({id: groupId});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    }

    // Поиск в группе отправителя запроса и получателя
    let sender;
    let recipient;
    for (let user of group.users) {
        if (user.id == senderId) {
            sender = user;
        } 
        else if (user.id == userId) {
            recipient = user;
        }
    }

    if (!sender) {
        return sendResponse(res, 400, Text.error.notGroupMember);
    } 
    else if (!recipient) {
        return sendResponse(res, 400, Text.error.requestedUserNotGroupMember); 
    } 
    else {
        let permission = 'kick-' + recipient.role;
        if (!permissions[sender.role].includes(permission)) {
            return sendResponse(res, 400, Text.error.permissionDenied); 
        } 
        else {
            // Все проверки пройдены, удаляем пользователя из группы
            await groupsCollection.updateOne( {id: groupId}, { $pull: {users: {id: recipient.id}} } );
            return sendResponse(res, 200, Text.success.userDeleted);
        }
    }
});

groups.put('/group-name', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, groupName } = req.body;

    let group = await groupsCollection.find({id: groupId});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    }

    let sender;
    for (let user of group.users) {
        if (user.id == senderId) {
            sender = user;
        }
    }

    if (!sender) {
        return sendResponse(res, 400, Text.error.notGroupMember);
    } 
    else if ( !Validator.groupName(groupName) ) {
        return sendResponse(res, 400, Text.error.validation.groupName); 
    }
    else {
        if (!permissions[sender.role].includes('editGroupInfo')) {
            return sendResponse(res, 400, Text.error.permissionDenied); 
        } 
        else {
            // Все проверки пройдены, изменяем название группы
            group.name = groupName;
            await groupsCollection.updateOne( {id: groupId}, {$set: {name: groupName}} );
            return sendResponse(res, 200, Text.success.groupNameUpdated);
        }
    }
})