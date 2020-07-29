var mysql = require('mysql');

var mysqlService = {

    // connection: connection,
    connection: function() {
        connection = mysql.createConnection({
            host: 'localhost',
            password: 'enixlin1981',
            user: 'root',
            database: 'jmrc'
        });
        connection.connect();
        return connection;
    },
    // query: function(url, cb) {
    //     connection.query(url, cb(err, rows, fields));
    // },
    // close: function() {
    //     connection.end();
    // }
};




module.exports = mysqlService;