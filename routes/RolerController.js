var express = require("express");
var router = express.Router();
var RolerServie = require("../service/RolerService");

/* GET home page. */
router.all("/getAllRolers", function(req, res, next) {
    let rolerService = new RolerServie();
    rolerService.getAllRolers().then(result => res.send(result));
});

router.all("/addRoler", function(req, res, next) {
    let name = req.body.name;
    let roler = { name };
    let rolerService = new RolerServie();
    rolerService.addRoler(roler).then(result => res.send(result));
});

router.all("/deleteRoler", function(req, res, next) {
    let id = req.body.id;
    let roler = { id };
    let rolerService = new RolerServie();
    rolerService.deleteRoler(roler).then(result => res.send(result));
});

router.all("/saveRoler", function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let roler = { id, name };
    let rolerService = new RolerServie();
    rolerService.saveRoler(roler).then(result => res.send(result));
});




// 取得角色的功能
router.all("/getRolerFeatures", function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let roler = { id, name };
    let rolerService = new RolerServie();
    rolerService.getRolerFeatures(roler).then(result => res.send(result));
});


//  设置角色的功能
router.all("/setRolerFeatures", function(req, res, next) {
    let id = req.body.id;
    let featurelist = req.body.featurelist;
    let params = [];
    let roler = { id };
    featurelist.forEach(element => {
        params.push([id, element]);
    });
    let rolerService = new RolerServie();
    rolerService.delRolerFeature(roler).then(result => {
        rolerService.setRolerFeatures(params).then(result => res.send(result));
    });

});

// delUserRolers 设置用户的角色
router.all("/delRolerFeature", function(req, res, next) {
    let id = req.body.id;
    let roler = { id };
    let rolerService = new RolerServie();
    rolerService.delRolerFeature(roler).then(result => res.send(result));
});


router.all("/isExistRoler", function(req, res, next) {
    let name = req.body.name;
    let roler = { name };
    let rolerService = new RolerServie();
    rolerService.isExist(roler).then(result => res.send(result));
});

//
module.exports = router;