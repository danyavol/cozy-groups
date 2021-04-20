// Создать пост
// Создать опрос

const express = require('express');
const posts = express.Router();
module.exports = posts;

posts.post('/:groupId', async (req, res) => {

    const post = {
        id: 123,
        groupId: 123,
        author: 'authorId',
        type: 'default/quiz',
        title: '123',
        description: ''        
    }
});