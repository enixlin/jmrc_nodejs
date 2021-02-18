var express = require("express");
var router = express.Router();
var ss = require("./../service/SettlementService");
var SettlementService = new ss();

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

//取得国际结算量数据的最近日期
/**
 * @api {get} settle/getSettleRecordDate  取得国际结算量数据的最近日期
 * @apiName getSettleRecordDate
 * @apiGroup settle
 *
 *
 * @apiSuccess {string} name 易融资各项产品的业务名称.
 * @apiSuccess {string} type 易融资各项产品的业务表内外标志.
 * @apiSuccess {string} balance_rmx_c 易融资各项产品的业务当期余额-综合人民币.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "信用证",
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *
 *     }
 */
//取得最新的业务日期
router.all("/getSettleRecordDate", async(req, res, next) => {
    res.send(await SettlementService.getSettleRecordDate());
});

//取得全行的国际结算量任务量
router.all("/getTotalSettleTask", async(req, res, next) => {
    console.log("end");
    console.log(req.body.end);
    let end = req.body.end.substring(0, 4);
    res.send(await SettlementService.getTotalSettleTask(end));
});

//

router.all("/getTotalSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getTotalSettle(start, end));
});
//取得全行所有经营单位的国际结算量
router.all("/getTotalUnitSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getTotalUnitSettle(start, end));
});

// 取得全行国际结算量分月统计量;
router.all("/getTotalMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getTotalMonthSettle(start, end));
});

// 取得全行单项国结产品的分月统计量;
router.all("/getProductMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getProductMonthSettle(product, start, end));
});

// 取得全行各国际结算产品的统计量;
router.all("/getTotalRangeProductSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await SettlementService.getTotalRangeProductSettlement(start, end));
});

// 取得办理该项产品的所有的客户;
router.all("/getProductClientSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let product = [];
    product.push(req.body.product);
    console.log(start);
    console.log(end);
    console.log(product);

    res.send(
        await SettlementService.getProductClientSettlement(start, end, product)
    );
});
// 取得办理该项产品的所有的支行;
router.all("/getProductUnitSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await SettlementService.getProductUnitSettlement(start, end));
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//取得支行的国际结算量
router.all("/getUnitSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getUnitSettle(start, end, unit));
});

//取得支行的国际结算量任务
router.all("/getUnitsSettleTask", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await SettlementService.getUnitsSettleTask(start, end));
});
//取得指定支行的国际结算量任务
router.all("/getUnitSettleTask", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    res.send(await SettlementService.getUnitSettleTask(start, end, unit));
});

//取得支行的国际结算量任务分季度比例
router.all("/getTaskPercent", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    res.send(await SettlementService.getTaskPercent(start, end));
});

// 取得支行国际结算量分月统计量;
router.all("/getUnitMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getUnitMonthSettle(start, end, unit));
});

// 取得支行单项产品国际结算量分月统计量;
router.all("/getUnitProductMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    res.send(
        await SettlementService.getUnitProductMonthSettle(start, end, unit, product)
    );
});

// 取得支行各项产品国际结算量统计量;
router.all("/getUnitProductSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    console.log(start);
    console.log(end);
    console.log(unit);
    res.send(await SettlementService.getUnitProductSettlement(start, end, unit));
});

// 取得支行各项产品国际结算量统计量;
router.all("/getUnitProductClientSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    console.log(unit);
    res.send(
        await SettlementService.getUnitProductClientSettlement(
            start,
            end,
            unit,
            product
        )
    );
});

// 取得支行各个客户的国际结算量
router.all("/getUnitCientSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getUnitCientSettle(start, end, unit));
});
// 取得支行各国际结算产品的统计量;
router.all("/getUnitRangeProductSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let unit = req.body.unit;
    res.send(
        await SettlementService.getUnitRangeProductSettlement(start, end, unit)
    );
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//取得客户的国际结算量
router.all("/getClientSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getClientSettle(start, end, client));
});

//取得所有客户的国际结算量
router.all("/getAllClientSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getAllClientSettle(start, end));
});

// 取得客户国际结算量分月统计量;
router.all("/getClientMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    console.log(start);
    console.log(end);
    res.send(await SettlementService.getClientMonthSettle(start, end, client));
});
// getClientProductMonthSettlebyname
// 取得客户某项国际结算量分月统计量;
router.all("/getClientProductMonthSettlebyname", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    console.log(client);
    console.log(product);
    res.send(
        await SettlementService.getClientProductMonthSettlebyname(
            start,
            end,
            client,
            product
        )
    );
});
// 取得客户某项国际结算量分月统计量;
router.all("/getClientProductMonthSettle", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    let product = req.body.product;
    console.log(start);
    console.log(end);
    console.log(client);
    console.log(product);
    res.send(
        await SettlementService.getClientProductMonthSettle(
            start,
            end,
            client,
            product
        )
    );
});

// 取得客户的各国际结算产品的统计量;
router.all("/getClientRangeProductSettlement", async(req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let client = req.body.client;
    res.send(
        await SettlementService.getClientRangeProductSettlement(start, end, client)
    );
});

/* 
============================================================================
============================================================================
以下是国际结算量的口径产品设置
============================================================================
============================================================================
*/
// saveSettlementRangeProduct;
router.all("/saveSettlementRangeProduct", async(req, res, next) => {
    console.log(req.body.products);
    res.send(
        await SettlementService.saveSettlementRangeProduct(req.body.products)
    );
});

router.all("/getSettleRangeProducts", async(req, res, next) => {
    // console.log(await SettlementService.getSettleRangeProducts());
    res.send(await SettlementService.getSettleRangeProducts());
});

router.all("/getAllProductFromRecord", async(req, res, next) => {
    res.send(await SettlementService.getAllProductFromRecord());
});
//##########################################################################
//##########################################################################
module.exports = router;