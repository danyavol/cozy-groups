const express = require('express');
const posts = express.Router();
module.exports = posts;

const {v4: uuidv4} = require('uuid');
const { getPostDTO, getCommentDTO } = require('../../service/dto.js');
const groupsCollection = require('../../database/database.js')('groups');
const postsCollection = require('../../database/database.js')('posts');
const commentsCollection = require('../../database/database.js')('comments');
const permissions = require('../../service/permissions.js');
const Text = require('../../service/responseMessages.js');
const { sendResponse } = require('../../service/requestService.js');



posts.get('/:groupId', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId } = req.params;


    const group = await groupsCollection.find({id: groupId});
    if (!group) return sendResponse(res, 400, Text.error.findGroupById);

    const user = group.users.filter(u => u.id === senderId)[0];
    if (!user) return sendResponse(res, 400, Text.error.notGroupMember);


    let posts = await postsCollection.find({groupId: groupId}, true);
    posts = await getPostDTO(posts);

    return sendResponse(res, 200, null, {posts: posts});
});

posts.get('/:groupId/post/:postId', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId, postId } = req.params;


    let group, post;
    await Promise.all([
        groupsCollection.find({id: groupId}),
        postsCollection.find({groupId: groupId, id: postId})
    ]).then(result => { group = result[0]; post = result[1] });

    if (!group) return sendResponse(res, 400, Text.error.findGroupById);
    if (!post) return sendResponse(res, 400, Text.error.findPostById);

    const user = group.users.filter(u => u.id === senderId)[0];
    if (!user) return sendResponse(res, 400, Text.error.notGroupMember);


    let comments = await commentsCollection.find({groupId, postId, id: {$in: post.comments}}, true);
    comments = await getCommentDTO(comments);

    post = await getPostDTO(post, true);
    post.comments = comments;

    return sendResponse(res, 200, null, {post});
});

posts.post('/:groupId/comment/:postId', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId, postId } = req.params;
    let { text } = req.body;


    let group, post;
    await Promise.all([
        groupsCollection.find({id: groupId}),
        postsCollection.find({groupId: groupId, id: postId})
    ]).then(result => { group = result[0]; post = result[1] });

    if (!group) return sendResponse(res, 400, Text.error.findGroupById);
    if (!post) return sendResponse(res, 400, Text.error.findPostById);

    const user = group.users.filter(u => u.id === senderId)[0];
    if (!user) return sendResponse(res, 400, Text.error.notGroupMember);


    let comment = {
        id: uuidv4(),
        groupId,
        postId,
        authorId: senderId,
        createdAt: Date.now(),
        text
    };
    
    await commentsCollection.insertOne(comment);
    postsCollection.updateOne({groupId, id: postId}, {$push: {comments: comment.id}} )
    comment = await getCommentDTO(comment);

    return sendResponse(res, 200, null, {comment});
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