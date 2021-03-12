// Кикнуть
// Изменить информацию о группе
// Обновить код приглашения

const express = require('express');
const groups = express.Router();
module.exports = groups;

const permissions = require('../../service/permissions.js');
const groupsCollection = require('../../database/groups.js');
const generateCode = require('../../service/codeGenerator.js');
const Text = require('../../service/responseMessages.js')
const { sendResponse } = require('../../service/requestService.js');


groups.put('/invite-code', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.body;

    let group = await groupsCollection.findGroup({id: groupId});

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
        let allGroups = await groupsCollection.findGroup(null, true);
        
        let inviteCode = generateCode(allGroups, 'inviteCode');

        groupsCollection.updateGroup({id: groupId}, {$set: {inviteCode: inviteCode}})
        
        return sendResponse(res, 200, null, {inviteCode: inviteCode});
    }
});