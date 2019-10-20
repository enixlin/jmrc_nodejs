var mysql = require('./mysqlService');

class settleService {
    constructor() {
        this.connection = mysql.connection();
    };

    getLastBusyDate(cb) {
        let sqlString = "select busy_date from settle_record order by busy_date desc limit 1";
        this.connection.query(sqlString, function(err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(rows);
            }
        });
    };
    getBusyRecord(cb) {
        let sqlString = "select * from settle_record order by busy_date desc limit 10";
        this.connection.query(sqlString, function(err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(rows);
            }
        });
    };


}



module.exports = settleService;