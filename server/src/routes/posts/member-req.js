// Получить список всех постов группы
// Получить один пост со всеми подробностями

const express = require('express');
const posts = express.Router();
module.exports = posts;

const { getPostDTO } = require('../../service/dto.js');
const groupsCollection = require('../../database/database.js')('groups');
const postsCollection = require('../../database/database.js')('posts');
const permissions = require('../../service/permissions.js');
const Text = require('../../service/responseMessages.js');
const { sendResponse } = require('../../service/requestService.js');

posts.get('/:groupId', async (req, res) => {
    let senderId = res.locals.userId;
    let { groupId } = req.params;

    let group = await groupsCollection.find({id: groupId});
    if (!group) return sendResponse(res, 400, Text.error.findGroupById);

    let author = group.users.filter(u => u.id === senderId)[0];
    if (!author) {
        return sendResponse(res, 400, Text.error.notGroupMember);
    } 
    else {
        let posts = await postsCollection.find({groupId: groupId}, true);

        posts = await getPostDTO(posts);

        return sendResponse(res, 200, null, {posts: posts});
    }
});






// Приходит вместе с запросом GET posts/{groupId}/post/{postId}
//
// comments: [
//     {
//         author: {
//             id: 'user-123123dsc-s1dfs3adc-123ecs4ax',
//             login: 'kek228', 
//             firstName: 'Dima', 
//             lastName: null
//         },
//         text: 'Пост говно, автор лох, я пиздабол',
//         createdAt: 16821931023
//     }, 
//     { ... }
// ]