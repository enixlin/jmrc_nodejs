var mysql = require('./mysqlService');

var User = {
    getAllUser: function(cb) {
        let connection = mysql.connection();
        let sqlString = "select * from user";
        connection.query(sqlString, function(err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb({ rows, fields });
            }
        });

    },
    getuserPromise: function() {

        let connection = mysql.connection();
        let sqlString = "select * from user";
        let p = new Promise(function(resolve, reject) {
            connection.query(sqlString, function(err, rows, fields) {
                if (err) {
                    return resolve(err);
                } else {
                    return resolve(rows);
                }
            });
        });
        Promise.all(p).then(function(result) {
            return result;
        });


    },

    addUser: function(user, cb) {
        let connection = mysql.connection();
        let sqlString = "insert into user values set ?";
        connection.query(sqlString, [user, user], function(err, result, fields) {
            if (err) {
                cb(err);
            } else {
                cb(result);
            }
        });
    },


    deleteUser: function(id, cb) {
        let connection = mysql.connection();
        let sqlString = "delete from user where ?";
        connection.query(sqlString, id, function(err, result, fields) {
            if (err) {
                cb(err);
            } else {
                cb(result);
            }
        });
    },


    saveUser: function(user, cb) {
        let connection = mysql.connection();
        let sqlString = "update user set  ? where ?";
        connection.query(sqlString, user, function(err, result, fields) {
            if (err) {
                cb(err);
            } else {
                cb(result);
            }
        });
    },


};


module.exports = User;