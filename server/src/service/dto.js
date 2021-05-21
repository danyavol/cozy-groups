const usersCollection = require('../database/database.js')('users');



// data  =>  single post or array
exports.getPostDTO =  async function (data) {

    if (Array.isArray(data)) {
        const allUsers = await usersCollection.find(null, true);

        data.forEach(post => {
            const user = allUsers.find(user => user.id === post.authorId);
            post = handleSinglePost(post, user);
        });
    } 
    else {
        const author = await usersCollection.find({id: data.authorId});
        
        data = handleSinglePost(data, author);
    }
    
    return data;



    function handleSinglePost(post, author={}) {
        post.author = {
            id: author.id,
            login: author.login,
            firstName: author.firstName,
            lastName: author.lastName
        };
        post.totalComments = post.comments.length;
    
        const fieldsToDelete = ['_id', 'groupId', 'authorId', 'comments'];
        fieldsToDelete.forEach(field => delete post[field]);

        return post;
    }

}


// data  =>  single comment or array
exports.getCommentDTO =  async function (data) {

    if (Array.isArray(data)) {
        const allUsers = await usersCollection.find(null, true);

        data.forEach(comment => {
            const user = allUsers.find(user => user.id === comment.authorId);
            comment = handleSingleComment(comment, user);
        });
    } 
    else {
        const author = await usersCollection.find({id: data.authorId});
        
        data = handleSingleComment(data, author);
    }
    
    return data;



    function handleSingleComment(comment, author={}) {
        comment.author = {
            id: author.id,
            login: author.login,
            firstName: author.firstName,
            lastName: author.lastName
        };
    
        const fieldsToDelete = ['_id', 'groupId', 'postId', 'authorId'];
        fieldsToDelete.forEach(field => delete comment[field]);

        return comment;
    }

}