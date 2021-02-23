module.exports.userDTO = (user) => {
    let userCopy = JSON.parse(JSON.stringify(user));

    delete userCopy._id;
    delete userCopy.password;

    return userCopy;
}