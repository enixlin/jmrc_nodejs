var express = require("express");
var router = express.Router();
var tfbs = require("../service/TF/TFBusyService");
var TFBusyService = new tfbs();

// getBNTFBalanceDays
router.all("/getBNTFBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await TFBusyService.getBNTFBalanceDays(start, end));
});

/**
 *
 * @api {/tf/getBNTFProductDays} /tf/getBNTFProductDays 取得贸易融资各项产品的日余额
 * @apiName getBNTFProductDays
 * @apiGroup tf
 * @apiVersion
 *
 * @apiParam  {String} start 开始日期
 * @apiParam  {String} end 结束日期
 * @apiParam  {String} product u
 *
 * @apiSuccess (200) {type} name description
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *     start : "20200731"
 *     end : "20201231"
 *     product : "进口押汇"
 * }
 *
 *
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 *
 */
router.all("/getBNTFBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await TFBusyService.getBNTFBalanceDays(start, end));
});



router.all("/getTFProductBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    console.log(product);

    res.send(await TFBusyService.getTFProductBalanceDays(start, end, product));
});

// getTFClientProductBalanceDays
router.all("/getTFClientProductBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.product;
    let client = req.body.client;
    console.log(start);
    console.log(end);
    console.log(product);
    console.log(client);
    res.send(await TFBusyService.getTFClientProductBalanceDays(start, end, product, client));
});


// getTFClientBNBalanceDays
router.all("/getTFClientBNBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    console.log(start);
    console.log(end);
    console.log(client);
    res.send(await TFBusyService.getTFClientBNBalanceDays(start, end, client));
});

router.all("/getTFClientBWBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    console.log(start);
    console.log(end);
    console.log(client);
    res.send(await TFBusyService.getTFClientBWBalanceDays(start, end, client));
});

router.all("/getBWTFBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await TFBusyService.getBWTFBalanceDays(start, end));
});

/**
 * 
 * @api {getTFProductsBalanceByDate} /getTFProductsBalanceByDate 取得某一时点贸易融资各项产品的余额
 * @apiName getTFProductsBalanceByDate
 * @apiGroup  tf
 * @apiVersion  major.minor.patch
 * 
 * 
 * @apiParam  {String} date 查询日期
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     date : 20200630
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * [
 *     {
        "name": "信用证",
        "amount_rmb_c": 0,
        "amount_rmx_c": 4757492.55,
        "amount_usx_c": 681120.8,
        "amount_rmb_p": 0,
        "amount_rmx_p": 0,
        "amount_usx_p": 0
    }
 * ]
 * 
 * 
 */
router.all("/getTFProductsBalanceByDate", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await TFBusyService.getTFProductsBalanceByDate(start, end));
});


/**
 * 
 * @api {/tf/getTFProductClientBalanceByDate} /getTFProductClientBalanceByDate 查询单项贸易融资产品的办理客户
 * @apiName getTFProductClientBalanceByDate
 * @apiGroup tf
 * @apiVersion  major.minor.patch
 * 
 * 
 * @apiParam  {String} date 查询日期　
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     date : 20200630
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
router.all("/getTFProductClientsBalanceByDate", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    console.log(product);
    res.send(await TFBusyService.getTFProductClientsBalanceByDate(start, end, product));
});



/**
 * 
 * @api {/tf/getTFClientProductsBalanceByDate} /getTFClientProductsBalanceByDate 取得某一时点客户的办理贸易融资产品的分类余额
 * @apiName getTFClientProductsBalanceByDate
 * @apiGroup tf
 * @apiVersion  major.minor.patch
 * 
 * 
 * @apiParam  {String} date 查询日期
 * @apiParam  {String} client 客户名称
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {json} Request-Example:
 * {
 *     date : 20200630,
 *     client:"江门市新轻出进出口有限公司"
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * [
 *     {
        "name": "信用证",
        "amount_rmb_c": 0,
        "amount_rmx_c": 4757492.55,
        "amount_usx_c": 681120.8,
        "amount_rmb_p": 0,
        "amount_rmx_p": 0,
        "amount_usx_p": 0
    }
 * ]
 * 
 * 
 */
//
router.post("/getTFClientProductsBalanceByDate", async(req, res, next) => {
    let date = req.body.date;
    let client = req.body.client;
    console.log(date);
    res.send(await TFBusyService.getTFClientProductsBalanceByDate(date, client));
});



router.post("/getClientsBNTFBalanceByDate", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    // console.log(date);
    res.send(await TFBusyService.getClientsBNTFBalanceByDate(start, end));
});


router.post("/getClientsBWTFBalanceByDate", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await TFBusyService.getClientsBWTFBalanceByDate(start, end));
});

router.post("/getTFProductClientBalanceDays", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.product;
    let client = req.body.client;
    res.send(await TFBusyService.getTFProductClientBalanceDays(start, end, product, client));
});

// 取得最近的贸易融资业务记录日期
router.post("/getLastTFDate", async(req, res, next) => {
    res.send(await TFBusyService.getLastTFDate());
});

// 
module.exports = router;