var express = require("express");
var router = express.Router();
var userService = require("./../service/UserService");

/* GET home page. */
router.all("/", function(req, res, next) {
  let p1 = new Promise((resolve, reject) => {
    return resolve("p1");
  });

  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve("p2");
    }, 2000);
  });

  p2.then(r2 => {
    console.log(r2);
    resolve(p1);
  }).then(r1 => {
    console.log(r1);
  });
});

router.all("/checkUser", (req, res, next) => {
  let checkUser = { name: req.query.name };
  let u = new userService();
  u.isExist(checkUser)
    .then(result => {
      return new Promise((resolve, reject) => {
        return resolve(result);
      });
    })
    .then(result => {
      res.send(result);
    });
});
module.exports = router;
