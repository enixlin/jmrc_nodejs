var express = require("express");
var router = express.Router();
var UserServie = require("./../service/UserService");

/* GET home page. */
router.all("/getAllUsers", function(req, res, next) {
  let userService = new UserServie();
  userService.getAllUsers().then(result => res.send(result));
});

router.all("/addUser", function(req, res, next) {
  let name = req.query.name;
  let password = req.query.password;
  let user = { name, password };
  let userService = new UserServie();

  userService.isExist(user).then(result => {
    if (result) {
      res.send("user is exist");
    } else {
      userService.addUser(user).then(result => res.send(result));
    }
  });
});

router.all("/deleteUser", function(req, res, next) {
  let id = req.query.id;
  let user = { id };
  let userService = new UserServie();
  userService.deleteUser(user).then(result => res.send(result));
});

router.all("/saveUser", function(req, res, next) {
  let id = req.query.id;
  let name = req.query.name;
  let status = req.query.status;
  let password = req.query.password;
  let user = { id, name, password, status };
  let userService = new UserServie();
  userService.saveUser(user).then(result => res.send(result));
});

router.all("/isExistUser", function(req, res, next) {
  let name = req.query.name;
  let user = { name };
  let userService = new UserServie();
  userService.isExist(user).then(result => res.send(result));
});

router.all("/testPromise", function(req, res, next) {
  let p1 = new Promise(function(resolve, reject) {
    return resolve("ppp111");
  });

  let p2 = new Promise(function(resolve, reject) {
    resolve(p1.then(result => result + "aa222"));
  });
  p2.then(result => res.send(result)).catch(error => console.log(error));
});

//
module.exports = router;
