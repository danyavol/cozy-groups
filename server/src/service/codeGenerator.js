module.exports = (dataArray, field, codeType) => {
    // Получение существующих кодов, чтобы избежать повтора
    const existingCodes = [];
    if (dataArray && field)
        dataArray.map( item => existingCodes.push(item[field]) );

    // Определение набора символов и длины кода
    let characters, codeLength;
    switch (codeType) {
        case 'group_inviteCode':
            characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            codeLength = 6;
            break;
        case 'group_id':
            characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            codeLength = 6;
            break;
        case 'post_id':
            characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            codeLength = 6;
            break;
        default:
            characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            codeLength = 8;
    }

    // Создание кода
    let code;
    do {
        code = randomCode(characters, codeLength);
    } while (existingCodes.includes(code));

    return code;
}

function randomCode(characters, codeLength) {
    let result = '';

    for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}