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

// getUserRolers 取得用户的角色
router.all("/getUserRolers", function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let user = { id, name };
    let userService = new UserServie();
    userService.getUserRolers(user).then(result => res.send(result));
});


// setUserRolers 设置用户的角色
router.all("/setUserRolers", function(req, res, next) {
    let id = req.body.id;
    let rolerlist = req.body.rolerlist;
    let params = [];
    let user = { id };
    console.log(rolerlist);
    rolerlist.forEach(element => {
        params.push([id, element]);
    });
    let userService = new UserServie();
    userService.delUserRoler(user).then(result => {
        userService.setUserRolers(params).then(result => res.send(result));
    });

});

// delUserRolers 设置用户的角色
router.all("/delUserRolers", function(req, res, next) {
    let id = req.body.id;
    let user = { id };
    let userService = new UserServie();
    userService.delUserRolers(user).then(result => res.send(result));
});



router.all("/isExistUser", function(req, res, next) {
    let name = req.body.name;
    let user = { name };
    let userService = new UserServie();
    userService.isExist(user).then(result => res.send(result));
});

//
module.exports = router;