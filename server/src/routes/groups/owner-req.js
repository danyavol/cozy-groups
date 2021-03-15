// Изменить роль участника
// Передать права владельца другому участнику

const express = require('express');
const groups = express.Router();
module.exports = groups;

const permissions = require('../../service/permissions.js');
const groupsCollection = require('../../database/groups.js');
const Text = require('../../service/responseMessages.js');
const { sendResponse } = require('../../service/requestService.js');



groups.post('/edit-role', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId, newRole } = req.body;

    if ( !permissions[newRole] ) {
        return sendResponse(res, 400, Text.error.wrongRole);
    } else if (senderId == userId) {
        return sendResponse(res, 400, Text.error.changeSelfRole);
    }

    // #1 Поиск группы
    let group = await groupsCollection.findGroup({id: groupId});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
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
            return sendResponse(res, 400, Text.error.notGroupMember);
        } else if (!recipientRole) {
            return sendResponse(res, 400, Text.error.requestedUserNotGroupMember);
        } else if (recipientRole == newRole) {
            return sendResponse(res, 400, Text.error.requestedUserAlreadyHaveRole);
        } else {
            // #3 Определение имеет ли отправитель право на данное действие
            let permission = recipientRole + '-set-' + newRole;

            if ( !permissions[senderRole].includes(permission) ) {
                return sendResponse(res, 400, Text.error.permissionDenied);
            } else {
                // Проверки пройдены, изменяем права пользователя
                for (let user of group.users) {
                    if (user.id == userId) {
                        user.role = newRole;
                    }
                }

                await groupsCollection.updateGroup({id: groupId}, {$set: {users: group.users}});

                return sendResponse(res, 200, Text.success.userRoleChanged);
            }
        }
    }
});