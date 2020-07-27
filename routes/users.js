var express = require("express");
var router = express.Router();
var mysql = require("mysql");

/* GET users listing. */
router.all("/getusers", function(req, res, next) {
  var connection = mysql.createConnection({
    host: "111.229.91.24",
    user: "linzhenhuan",
    password: "enixlin1981",
    database: "jmrc"
  });

  connection.connect();

  connection.query("SELECT * from user ", function(error, results, fields) {
    if (error) throw error;
    console.log("The solution is: ", results[0]);
    res.send(results);
  });
});

router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
