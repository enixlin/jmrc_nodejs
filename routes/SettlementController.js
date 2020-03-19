var express = require("express");
var router = express.Router();
var ss = require("./../service/SettlementService");
var SettlementService = new ss();

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//取得全行的国际结算量
router.all("/getTotalSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getTotalSettle(start, end));
});
//取得全行所有经营单位的国际结算量
router.all("/getTotalUnitSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getTotalUnitSettle(start, end));
});

// 取得全行国际结算量分月统计量;
router.all("/getTotalMonthSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getTotalMonthSettle(start, end));
});
// 取得全行各国际结算产品的统计量;
router.all("/getTotalRangeProductSettlement", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  res.send(await SettlementService.getTotalRangeProductSettlement(start, end));
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//取得支行的国际结算量
router.all("/getUnitSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let unit = req.query.unit;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getUnitSettle(start, end, unit));
});

// 取得支行国际结算量分月统计量;
router.all("/getUnitMonthSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let unit = req.query.unit;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getUnitMonthSettle(start, end, unit));
});

// 取得支行各个客户的国际结算量
router.all("/getUnitCientSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let unit = req.query.unit;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getUnitCientSettle(start, end, unit));
});
// 取得支行各国际结算产品的统计量;
router.all("/getUnitRangeProductSettlement", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let unit = req.query.unit;
  res.send(
    await SettlementService.getUnitRangeProductSettlement(start, end, unit)
  );
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//取得客户的国际结算量
router.all("/getClientSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let client = req.query.client;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getClientSettle(start, end, client));
});

// 取得客户国际结算量分月统计量;
router.all("/getClientMonthSettle", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let client = req.query.client;
  console.log(start);
  console.log(end);
  res.send(await SettlementService.getClientMonthSettle(start, end, client));
});
// 取得客户的各国际结算产品的统计量;
router.all("/getClientRangeProductSettlement", async (req, res, next) => {
  let start = req.query.start;
  let end = req.query.end;
  let client = req.query.client;
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
router.all("/saveSettlementRangeProduct", async (req, res, next) => {
  console.log(req.body.products);
  res.send(
    await SettlementService.saveSettlementRangeProduct(req.body.products)
  );
});

router.all("/getSettleRangeProducts", async (req, res, next) => {
  // console.log(await SettlementService.getSettleRangeProducts());
  res.send(await SettlementService.getSettleRangeProducts());
});

router.all("/getAllProductFromRecord", async (req, res, next) => {
  res.send(await SettlementService.getAllProductFromRecord());
});
//##########################################################################
//##########################################################################
module.exports = router;
