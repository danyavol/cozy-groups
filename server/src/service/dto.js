const usersCollection = require('../database/database.js')('users');



// data  =>  single post or array
exports.getPostDTO =  async function (data) {
    const allUsers = await usersCollection.find(null, true);

    if (Array.isArray(data)) {
        data.forEach(post => {
            const user = allUsers.find(user => user.id === post.authorId);
            post = handleSinglePost(post, user, allUsers);
        });
    } 
    else {
        const author = allUsers.find(user => user.id === data.authorId);
        data = handleSinglePost(data, author, allUsers);
    }
    
    return data;



    function handleSinglePost(post, author={}, allUsers) {
        post.author = getAuthor(author);
        post.totalComments = post.comments.length;
    
        const fieldsToDelete = ['_id', 'groupId', 'authorId', 'comments'];
        fieldsToDelete.forEach(field => delete post[field]);

        if (post.type == 'quiz') {
            post.votes.forEach(vote => {
                const user = allUsers.find(user => user.id === vote.userId);
                vote.user = getAuthor(user);
                delete vote.userId;
            })
        }

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
        comment.author = getAuthor(author);
    
        const fieldsToDelete = ['_id', 'groupId', 'postId', 'authorId'];
        fieldsToDelete.forEach(field => delete comment[field]);

        return comment;
    }

}



function getAuthor(author) {
    return {
        id: author.id,
        login: author.login,
        firstName: author.firstName,
        lastName: author.lastName
    };
}