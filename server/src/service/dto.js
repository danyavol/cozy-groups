const usersCollection = require('../database/database.js')('users');



// data  =>  single post or array
exports.getPostDTO =  async function (data, extended=false) {

    if (Array.isArray(data)) {
        const allUsers = await usersCollection.find(null, true);

        for (let post of data)
            for (let user of allUsers)
                if (post.author === user.id) {
                    post = handleSinglePost(post, user, extended);
                    break;
                }
    } 
    else {
        const user = await usersCollection.find({id: data.author});
        
        data = handleSinglePost(data, user, extended);
    }
    
    return data;



    function handleSinglePost(post, author={}, extended) {
        post.author = {
            id: author.id,
            login: author.login,
            firstName: author.firstName,
            lastName: author.lastName
        };
        post.totalComments = post.comments.length;
    
        delete post._id;
        delete post.groupId;
        
        if (!extended) delete post.comments;

        return post;
    }

}