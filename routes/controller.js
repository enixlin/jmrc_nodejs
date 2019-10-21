var express = require('express');
var router = express.Router();
var excels = require('exceljs');
var settleService = require("./../service/SettleService");
var excelService = require("./../service/ExcelService");
var User = require('./../service/userService');
var mysqlService = require('./mysqlService');

router.all('/', function(req, res, next) {

    let users = [];
    User.getAllUser(function(result) {
        users = result;
        res.send(users.fields);
    });

});

router.all('/showUser', function(req, res, next) {
    // excelService.constructor("exclefile", "new Sheet");
    var excel = new excelService("header11.xls", "new sheet");

    let settle_i = new settleService();
    // let p = settle_i.getSettleRangeProduct();
    // settle_i.getSettleRangeProduct().then(settle_i.getUnitSettlePerformance(r)).then(function(re) {
    //     res.send(re);
    // });
    settle_i.getSettleRangeProduct().then(settle_i.getUnitSettlePerformance([result.products, "20190101", "20190930"])).then(function(re) {
        res.send(re);
    });
});

// Promise.all([p]).then(function(result) {
//     var products = result[0].products;
//     settle_i.getUnitSettlePerformance([products, "20190101", "20190930"]).then(function(r) {
//         res.send(r.rows);
//     });
// });



// Promise.all([p]).then(function(result) {
//     res.send(result);
// });
// console.log(p);

// settle_i.
// let params={["汇入汇款"],"20190101","20190930"}
// settle_i.getBusyRecord(function(result) {
//     let data = [];
//     let row = [];
//     if (result.length > 0) {
//         for (let col in result[0]) {
//             row.push(col);
//         }
//         data.push(row);
//     }
//     for (let n in result) {
//         row = [];
//         for (let e in result[n]) {
//             row.push(result[n][e] + "");
//         }
//         data.push(row);
//     }
//     excel.fillData(data);
//     excel.save();


//excel.save();
// let workbook = new excels.Workbook();
// workbook.addWorksheet("testSheet");
// workbook.csv.writeFile("public/textExcel.xls");
// res.send("done");


// });



router.all('/addUser', function(req, res, next) {
    let name = req.param("name");
    let password = req.param("password");
    let status = 1;
    User.addUser({ name, password, status }, function(result) {
        res.send(result)
    });
});


router.all('/deleteUser', function(req, res, next) {
    let userId = req.param("id");
    User.deleteUser({ id: userId }, function(result) {
        res.send(result)
    });
});

router.all('/saveUser', function(req, res, next) {
    let userId = req.param("id");
    let userName = req.param("name");
    let userPassword = req.param("password");
    let userStatus = req.param("status");
    let params = [{ name: userName, password: userPassword, status: userStatus }, { id: userId }];
    User.saveUser(params, function(result) {
        res.send(result)
    });
});

module.exports = router;