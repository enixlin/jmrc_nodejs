var express = require("express");
var router = express.Router();
var DBSerive = require("./../service/DBService");

/* GET home page. */
router.all("/getAllFeatures", function(req, res, next) {
  let ds = new DBSerive();
  let sql = "select * from feature";
  let params = [];
  ds.query(sql, params).then(result => {
    res.send(result);
  });
});

//
module.exports = router;
