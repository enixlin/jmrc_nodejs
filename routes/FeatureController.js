var express = require("express");
var router = express.Router();
var FeatureService = require("../service/FeatureSerivce");
const RolerService = require("../service/RolerService");
const UserService = require("../service/UserService");

/* GET home page. */
router.all("/getAllFeatures", function(req, res, next) {
    let featureService = new FeatureService();
    featureService.getAllFeatures().then((result) => res.send(result));
});

router.all("/addFeature", function(req, res, next) {
    let name = req.body.name;
    let url = req.body.url;
    let icon = req.body.icon;
    let leaf = req.body.leaf;
    let parent_id = req.body.parent_id;
    let panel = req.body.panel;
    let feature = { name, url, icon, leaf, parent_id, panel };
    let featureService = new FeatureService();
    featureService.addFeature(feature).then((result) => res.send(result));
});

router.all("/deleteFeature", function(req, res, next) {
    let id = req.body.id;
    let feature = { id };
    let featureService = new FeatureService();
    featureService.deleteFeature(feature).then((result) => res.send(result));
});

router.all("/saveFeature", function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let url = req.body.url;
    let icon = req.body.icon;
    let leaf = req.body.leaf;
    let parent_id = req.body.parent_id;
    let panel = req.body.panel;
    let feature = { id, name, url, icon, leaf, parent_id, panel };
    let featureService = new FeatureService();
    featureService.saveFeature(feature).then((result) => res.send(result));
});

//取得用户的功能
router.all("/getFeaturesByUser", async function(req, res, next) {
    let id = req.body.id;
    let user = { id };

    let userService = new UserService();
    let rolerService = new RolerService();
    let featureService = new FeatureService();

    userService.getUserRolers(user).then((result) => {
        console.log("roler result:");
        console.log(result);
        let rolers = result;
        let rolers_id_list = [];
        for (let index = 0; index < rolers.length; index++) {
            const element = rolers[index];
            rolers_id_list.push(element.roler_id);
        }
        console.log("roler_id_list result:");
        console.log(result);
        rolerService.getRolersFeatures(rolers_id_list).then(r => {
            let id_list = [];
            for (let index = 0; index < r.length; index++) {
                const element = r[index];
                id_list.push(element.feature_id);

            }
            console.log("feature_id_list result:");
            console.log(id_list);
            featureService.getFeatureByIds(id_list).then(rr => {
                res.send(rr);
            });
        });
    });


});

router.all("/isExistFeature", function(req, res, next) {
    let name = req.body.name;
    let feature = { name };
    let featureService = new FeatureService();
    featureService.isExist(feature).then((result) => res.send(result));
});

//
module.exports = router;
//
module.exports = router;