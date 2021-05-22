const express = require('express');
const posts = express.Router();
module.exports = posts;

const generateCode = require('../../service/codeGenerator.js');
const groupsCollection = require('../../database/database.js')('groups');
const postsCollection = require('../../database/database.js')('posts');
const permissions = require('../../service/permissions.js');
const Text = require('../../service/responseMessages.js');
const { sendResponse } = require('../../service/requestService.js');


async function generateBasicPost(groupId, authorId, type='default') {
    const posts = await postsCollection.find({id: groupId}, true);
    
    return {
        id: generateCode(posts, 'id', 'post_id'),
        groupId: groupId,
        authorId: authorId,
        createdAt: Date.now(),
        type: type,
        comments: []
    };
}


posts.post('/:groupId/default', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId } = req.params;
    const { title, description } = req.body;

    const group = await groupsCollection.find({id: groupId});
    if (!group) return sendResponse(res, 400, Text.error.findGroupById);
    
    const author = group.users.filter(u => u.id === senderId)[0];
    if (!author) return sendResponse(res, 400, Text.error.notGroupMember);

    if ( !permissions[author.role].includes('createPost') )
        return sendResponse(res, 400, Text.error.permissionDenied);

    if (!title) return sendResponse(res, 400, Text.error.emptyPostTitle);
    
    
    const post = await generateBasicPost(groupId, senderId, 'default');
    post.title = title;
    post.description = description || '';

    await postsCollection.insertOne(post);
    
    return sendResponse(res, 200, Text.success.postCreated);
    
});

posts.post('/:groupId/quiz', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId } = req.params;
    

    const group = await groupsCollection.find({id: groupId});
    if (!group) return sendResponse(res, 400, Text.error.findGroupById);
    
    const author = group.users.filter(u => u.id === senderId)[0];
    if (!author) return sendResponse(res, 400, Text.error.notGroupMember);

    if ( !permissions[author.role].includes('createQuiz') )
        return sendResponse(res, 400, Text.error.permissionDenied);
    
    const validationError = validateQuizParams(req.body);
    if (validationError) return sendResponse(res, 400, validationError);


    const post = await generateBasicPost(groupId, senderId, 'quiz');
    parseQuizRequest(post, req.body);

    await postsCollection.insertOne(post);
    
    return sendResponse(res, 200, Text.success.postCreated);
});


function validateQuizParams(params) {
    const { title, options, quizType, canCancel } = params;

    if (typeof title != 'string') return Text.error.emptyPostTitle;

    if (!Array.isArray(options) || options.length == 0) return Text.error.quizOptionsRequired;

    let optionsError = false;
    options.forEach(option => {
        if (!option || typeof option.id != 'number' || typeof option.value != 'string')
            optionsError = true;
    });
    if (optionsError) return Text.error.invalidQuizOptions;

    if (typeof quizType != 'number' || quizType < 0 || quizType > 2)
        return Text.error.invalidQuizType;

    if (typeof canCancel != 'boolean') return Text.error.quizCanCancelParamRequired;
}

function parseQuizRequest(post, params) {
    const { title, options, quizType, canCancel } = params;

    post.title = title;
    post.options = [];
    options.forEach( o => post.options.push({id: o.id, value: o.value}) );
    post.quizType = quizType;
    post.canCancel = canCancel;
    post.votes = [];

    return post;
}