var express = require("express");
var router = express.Router();
var AuthService = require("../service/AuthService");
var UserService = require("./../service/UserService");


router.all("/index", (req, res, next) => {
    res.redirect("/index.html")


});


router.all("/authUser", (req, res, next) => {
    console.log(req.body);
    let name = req.body.name;
    let password = req.body.password;
    let a = new AuthService();
    let b = new UserService();
    a.authUser({ name, password }).then(result => {
        console.log(result);
        let auth_user = result;
        req.session.username = auth_user.name;
        req.session.userid = auth_user.id;
        req.session.userstatus = auth_user.status;
        res.send(result);
    });
});

router.all("/checkAuth", (req, res, next) => {
    console.log(req.session.username);

    res.send({
        name: req.session.username,
        id: req.session.userid,
        status: req.session.userstatus
    });
});

router.all("/logout", (req, res, next) => {
    req.session.username = undefined;
    req.session.userid = undefined;
    req.session.userstatus = undefined;
    res.redirect("/");
});
module.exports = router;