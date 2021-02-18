var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.all("/", function(req, res, next) {
    // 这里的路径是nodejs 里的public
    fs.readdir("./public/images", function(err, files) {
        if (err) {
            return console.error(err);
        } else {
            let filesPath = [];
            files.forEach(function(file) {
                filesPath.push({ src: "/images/" + file });
            });

            console.log(filesPath);
            res.send(filesPath);
        }
    });
});

//
module.exports = router;