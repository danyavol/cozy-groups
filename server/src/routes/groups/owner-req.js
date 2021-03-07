// Изменить роль участника
// Передать права владельца другому участнику

const express = require('express');
const groups = express.Router();
module.exports = groups;

const permissions = require('../../service/permissions.js');
const groupsCollection = require('../../database/groups.js');



groups.post('/edit-role', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId, userId, newRole } = req.body;
    let response = {};

    if ( !permissions[newRole] ) {
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