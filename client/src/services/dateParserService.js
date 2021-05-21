const DateParser = {
    beautify(date) {
        const now = new Date();
        const time = this._getTime(date);

        if (now.getDate() === date.getDate())
            return 'Сегодня в ' + time;
        
        const nextDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
        if (nextDay.getDate() === now.getDate())
            return 'Вчера в ' + time;

        if (date.getFullYear() === now.getFullYear())
            return this._getDate(date) + ' в ' + time;
        
        return date.toLocaleDateString() + ' в ' + time;
    },

    _getTime(date) {
        let hours = date.getHours();
        if (hours < 10) hours = '0' + hours;

        let minutes = date.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;

        return hours + ':' + minutes;
    },

    _getDate(date) {
        const day = date.getDate();

        switch(date.getMonth()+1) {
            case 1: return day + ' января';
            case 2: return day + ' февраля';
            case 3: return day + ' марта';
            case 4: return day + ' апреля';
            case 5: return day + ' мая';
            case 6: return day + ' июня';
            case 7: return day + ' июля';
            case 8: return day + ' августа';
            case 9: return day + ' сентября';
            case 10: return day + ' октября';
            case 11: return day + ' ноября';
            case 12: return day + ' декабря';
            default: return date.toLocaleDateString();
        }
    }
}
export default DateParser;