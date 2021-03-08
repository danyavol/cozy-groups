module.exports = (groups, type) => {
    // Получение существующих кодов, чтобы избежать повтора
    let existingCodes = [];
    groups.map(group => existingCodes.push(group[type]));

    // Определение набора символов и длины кода
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let codeLength = 6;
    if (type == 'id') {
        characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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