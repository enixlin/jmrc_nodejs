class Tools {
    compareDate(date) {
        return (date.substr(0, 4) - 1) + date.substr(4, 8);
    }
}


module.exports = Tools;