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
        let sender, recipient;
        group.users.map(user => {
            user.id == senderId ? sender = user : null;
            user.id == userId ? recipient = user: null;
        });

        if (!sender) {
            return sendResponse(res, 400, Text.error.notGroupMember);
        } else if (!recipient) {
            return sendResponse(res, 400, Text.error.requestedUserNotGroupMember);
        } else if (recipient.role == newRole) {
            return sendResponse(res, 400, Text.error.requestedUserAlreadyHaveRole);
        } else {
            // #3 Определение имеет ли отправитель право на данное действие
            let permission = recipient.role + '-set-' + newRole;

            if ( !permissions[sender.role].includes(permission) ) {
                return sendResponse(res, 400, Text.error.permissionDenied);
            } else {
                // Проверки пройдены, изменяем права пользователя
                recipient.role = newRole;

                await groupsCollection.updateGroup({id: groupId}, {$set: {users: group.users}});

                return sendResponse(res, 200, Text.success.userRoleChanged);
            }
        }
    }
});

groups.post('/transfer-owner-rights', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId } = req.body;

    if (senderId == userId) {
        return sendResponse(res, 400, Text.error.changeSelfRole);
    }

    // Поиск группы
    let group = await groupsCollection.findGroup({id: groupId});
    if (!group) {
        return sendResponse(res, 400, Text.error.findGroupById);
    } else {
        // Поиск в группе отправителя и получателя
        let sender, recipient;
        group.users.map(user => {
            user.id == senderId ? sender = user : null;
            user.id == userId ? recipient = user: null;
        });

        if (!sender) {
            return sendResponse(res, 400, Text.error.notGroupMember);
        } 
        else if (!recipient) {
            return sendResponse(res, 400, Text.error.requestedUserNotGroupMember);
        }
        else if ( !permissions[sender.role].includes('transferOwnerRights') ) {
            return sendResponse(res, 400, Text.error.permissionDenied);
        }
        else {
            // Вся валидация пройдена, изменяем роли
            sender.role = 'admin';
            recipient.role = 'owner';

            await groupsCollection.updateGroup({id: groupId}, {$set: {users: group.users}});

            return sendResponse(res, 200, Text.success.ownerRoleTransfered);
        }
    }

});

groups.delete('/:groupId', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.params;

    // Поиск группы
    let group = await groupsCollection.findGroup({id: groupId});
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
    } else {
        if (!permissions[sender.role].includes('deleteGroup')) {
            return sendResponse(res, 400, Text.error.permissionDenied); 
        } 
        else {
            // Все проверки пройдены, удаляем группу
            await groupsCollection.deleteGroup( {id: groupId} );
            return sendResponse(res, 200, Text.success.groupDeleted);
        }
    }
});