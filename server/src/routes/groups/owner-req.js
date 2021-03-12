// Изменить роль участника
// Передать права владельца другому участнику

const express = require('express');
const groups = express.Router();
module.exports = groups;

const permissions = require('../../service/permissions.js');
const groupsCollection = require('../../database/groups.js');
const Text = require('../../service/responseMessages.js');



groups.post('/edit-role', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId, newRole } = req.body;
    let response = {};

    if ( !permissions[newRole] ) {
        res.status(400);
        response.ok = false;
        response.message = Text.error.wrongRole;
        return res.json(response);
    } else if (senderId == userId) {
        res.status(400);
        response.ok = false;
        response.message = Text.error.changeSelfRole;
        return res.json(response);
    }

    // #1 Поиск группы
    let group = await groupsCollection.findGroup({id: groupId});
    if (!group) {
        res.status(400);
        response.ok = false;
        response.message = Text.error.findGroupById;
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
            response.message = Text.error.notGroupMember;
        } else if (!recipientRole) {
            res.status(400);
            response.ok = false;
            response.message = Text.error.requestedUserNotGroupMember;
        } else if (recipientRole == newRole) {
            res.status(400);
            response.ok = false;
            response.message = Text.error.requestedUserAlreadyHaveRole;
        } else {
            // #3 Определение имеет ли отправитель право на данное действие
            let permission = recipientRole + '-set-' + newRole;

            if ( !permissions[senderRole].includes(permission) ) {
                res.status(400);
                response.ok = false;
                response.message = Text.error.permissionDenied;
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
                response.message = Text.success.userRoleChanged;
            }
        }
    }

    res.json(response);
});