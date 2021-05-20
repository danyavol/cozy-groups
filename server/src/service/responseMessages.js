module.exports = {
    error: {
        // Группы
        emptyGroupName: 'Введите название группы',
        findGroupByInviteCode: 'Группа с таким кодом приглашения не найдена',
        findGroupById: 'Группа c таким id не найдена',
        alreadyGroupMember: 'Вы уже состоите в этой группе',
        notGroupMember: 'Вы не состоите в этой группе',
        requestedUserNotGroupMember: 'Запрашиваемый пользователь не состоит в группе',
        // Роли
        wrongRole: 'Неверная роль. Доступные роли: member, editor, admin, owner',
        changeSelfRole: 'Нельзя изменить роль самому себе',
        requestedUserAlreadyHaveRole: 'Пользователь уже имеет такие права',
        ownerTryingToLeave: 'Нельзя выйти из группы являясь ее владельцем. Сперва передайте свои права другому участнику',
        permissionDenied: 'У вас недостаточно прав для данного действия',
        // Авторизация
        validation: {
            login: 'Неверный логин',
            password: 'Неверный пароль',
            firstName: 'Неверное имя',
            lastName: 'Неверная фамилия',
            groupName: 'Неверное название группы'
        },
        loginAlreadyTaken: 'Данный логин уже занят',
        emptyLogin: 'Введите логин',
        emptyPassword: 'Введите пароль',
        findUserByLogin: 'Пользователь с данным логином не найден',
        wrongPassword: 'Неверный пароль',
        // Посты
        emptyPostTitle: 'Введите заголовок поста',
        findPostById: 'Пост с таким id не найден',
        // Опросы
        quizOptionsRequired: 'Параметр options обязательный',
        quizCanCancelParamRequired: 'Параметр canCancel обязательный',
        invalidQuizOptions: 'Неверный формат параметра options',
        invalidQuizType: 'Неверный формат параметра quizType',
    },
    success: {
        // Группы
        groupCreated: 'Группа успешно создана',
        userJoinedGroup: 'Вы успешно присоединились к группе',
        userLeavedGroup: 'Вы успешно вышли из группы',
        userDeleted: 'Пользователь успешно удален',
        groupNameUpdated: 'Название группы успешно изменено',
        groupDeleted: 'Группа успешно удалена',
        // Роли
        userRoleChanged: 'Права пользователя успешно изменены',
        ownerRoleTransferred: 'Права владельца успешно переданы',
        // Авторизация
        userCreated: 'Пользователь успешно зарегистрирован',
        userAuthorized: 'Успешно авторизован',
        tokenDeleted: 'Токен успешно удален',
        // Посты
        postCreated: 'Пост успешно создан'
    }
}