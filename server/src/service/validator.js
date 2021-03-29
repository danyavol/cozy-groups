module.exports = {
    groupName(value) {
        return value.length > 0 && value.length < 50;
    },

    login(value) {
        const regexp = /^[\w\d]{2,15}$/;
        return regexp.test(value);
    },

    password(value) {
        // Обязательно как минимум одна: маленька буква, большая буква и цифра.
        // Не менее 4 символов. Можно любые спец.символы
        const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\d\w\W]{4,}$/;
        return regexp.test(value);
    },

    userName(value) {
        // Для фамилии и имени. Либо на английском, либо на русском от 2 до 20 символов
        const regexp = /^([A-Za-z]{2,20}|[А-Яа-я]{2,20})$/;
        return regexp.test(value);
    }
}