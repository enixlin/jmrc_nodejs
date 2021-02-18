var express = require("express");
var router = express.Router();
var AuthService = require("../service/AuthService");
var UserService = require("./../service/UserService");

router.all("/index", (req, res, next) => {

    res.send("result");

});


module.exports = router;