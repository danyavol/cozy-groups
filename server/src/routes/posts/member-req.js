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


posts.post('/:groupId/vote-quiz/:postId', async (req, res) => {
    const senderId = res.locals.userId;
    const { groupId, postId } = req.params;
    let { selectedOptions, removeVote } = req.body;


    let group, post;
    await Promise.all([
        groupsCollection.find({id: groupId}),
        postsCollection.find({groupId: groupId, id: postId})
    ]).then(result => { group = result[0]; post = result[1] });

    if (!group) return sendResponse(res, 400, Text.error.findGroupById);
    if (!post) return sendResponse(res, 400, Text.error.findPostById);

    const user = group.users.filter(u => u.id === senderId)[0];
    if (!user) return sendResponse(res, 400, Text.error.notGroupMember);

    if (post.type != 'quiz') return sendResponse(res, 400, Text.error.postMustBeQuizType);
    if (!Array.isArray(selectedOptions)) return sendResponse(res, 400, Text.error.selectedOptionsMustBeArray);

    const {quizType, canCancel, options} = post;
    const newVotes = getVotesForSave({quizType, canCancel, options}, post.votes, senderId, selectedOptions, removeVote);

    if (!newVotes.ok) return sendResponse(res, 400, newVotes.error);

    await postsCollection.updateOne({groupId, id: postId}, {$set: {votes: newVotes.data}});
    return sendResponse(res, 200, Text.success.voteSaved);

});

function getVotesForSave(quizConfig, votes, senderId, selectedOptions, removeVote) {
    // Проверка на сколько верно указаны айдишники опшенов
    let wrongOptions = false;
    selectedOptions.forEach(o => !quizConfig.options.find(op => op.id === o) ? wrongOptions = true : null);
    if (wrongOptions) return {ok: false, error: Text.error.noSuchOption}

    // Отмена голоса, но это запрещено
    if (removeVote && !quizConfig.canCancel) {
        return {ok: false, error: Text.error.notAllowedToCancelVote};
    } 
    // Отмена голоса
    else if (removeVote && quizConfig.canCancel) {
        const vote = votes.find(vote => vote.userId === senderId);
        if (vote) {
            let set = new Set(vote.selectedOptions);
            selectedOptions.forEach(o => set.delete(o));
            if (set.size == 0) votes.splice(votes.indexOf(vote), 1);
            else vote.selectedOptions = [...set];
        }
        return {ok: true, data: votes};
    }

    // Запись голоса
    
    // Множественный выбор
    if (quizConfig.quizType == 0) {
        const vote = votes.find(vote => vote.userId === senderId);
        if (vote && !quizConfig.canCancel) {
            return {ok: false, error: Text.error.notAllowedToChangeVote};
        } else if (vote && quizConfig.canCancel) {
            let set = new Set(vote.selectedOptions);
            selectedOptions.forEach(o => set.add(o));
            vote.selectedOptions = [...set];
        } else {
            votes.push({userId: senderId, selectedOptions});
        }
        return {ok: true, data: votes};
    }

    // Выбор одного варианта
    if (quizConfig.quizType == 1) {
        const vote = votes.find(vote => vote.userId === senderId);
        if (vote && !quizConfig.canCancel) {
            return {ok: false, error: Text.error.notAllowedToChangeVote};
        } else if (vote && quizConfig.canCancel) {
            vote.selectedOptions = [selectedOptions[0]];
        } else {
            votes.push({userId: senderId, selectedOptions: [selectedOptions[0]]})
        }
        return {ok: true, data: votes};
    }

    // Один вариант для одного человека
    if (quizConfig.quizType == 2) {
        const alreadyVoted = votes.find(vote => vote.selectedOptions.includes(selectedOptions[0]));
        if (alreadyVoted && alreadyVoted.userId !== senderId) {
            return {ok: false, error: Text.error.optionAlreadyVotedBySomeone}
        }
        const vote = votes.find(vote => vote.userId === senderId);
        if (vote && !quizConfig.canCancel) {
            return {ok: false, error: Text.error.notAllowedToChangeVote};
        } else if (vote && quizConfig.canCancel) {
            vote.selectedOptions = [selectedOptions[0]];
        } else {
            votes.push({userId: senderId, selectedOptions: [selectedOptions[0]]})
        }
        return {ok: true, data: votes};
    }
    
}