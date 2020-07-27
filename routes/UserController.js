var express = require("express");
var router = express.Router();
var UserServie = require("../service/UserService");

/* GET home page. */
router.all("/getAllUsers", function(req, res, next) {
  let userService = new UserServie();
  userService.getAllUsers().then(result => res.send(result));
});

router.all("/addUser", function(req, res, next) {
  let name = req.body.name;
  let password = req.body.password;
  let user = { name, password };
  let userService = new UserServie();
  userService.addUser(user).then(result => res.send(result));
});

router.all("/deleteUser", function(req, res, next) {
  let id = req.body.id;
  let user = { id };
  let userService = new UserServie();
  userService.deleteUser(user).then(result => res.send(result));
});

router.all("/saveUser", function(req, res, next) {
  let id = req.body.id;
  let name = req.body.name;
  let status = req.body.status;
  let password = req.body.password;
  let user = { id, name, password, status };
  let userService = new UserServie();
  userService.saveUser(user).then(result => res.send(result));
});

router.all("/isExistUser", function(req, res, next) {
  let name = req.body.name;
  let user = { name };
  let userService = new UserServie();
  userService.isExist(user).then(result => res.send(result));
});

//
module.exports = router;
