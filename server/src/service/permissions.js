// Роли и их права в группах

const memberPermissions = ['commentPost', 'voteQuiz'];

const editorPermissions = ['createPost', 'createQuiz'].concat(memberPermissions);

const adminPermissions = ['kick-member', 'kick-editor', 'member-set-editor', 'editor-set-member', 'editGroupInfo', 'updateInviteCode'].concat(editorPermissions);

const ownerPermissions = ['kick-admin', 'member-set-admin', 'editor-set-admin', 'admin-set-editor', 'admin-set-member', 'transferOwnerRights'].concat(adminPermissions);

module.exports = {
    member: memberPermissions,
    editor: editorPermissions,
    admin: adminPermissions,
    owner: ownerPermissions
};