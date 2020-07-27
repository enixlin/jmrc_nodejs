/**
 * 贸易融资服务
 * 这个服务可以提供以下的功能：
 * 1.国际贸易融资业务的查询分析
 *   （1）总业务量，支行业务量，客户业务量，产品业务量
 *   （2）贸易融资利息收入
 * 2.国际贸易融资客户的管理
 *   （1）客户的授信建议
 *   （2）客户风险分析
 * 3.
 *因为功勇太多了，都放在一个文件里，可能代码会太 长，因此还是要将这个服务拆分为三个文件
 * 1. 业务量    TF_Volume.js
 * 1. 收入      TF_profit.js
 * 1. 客户    TF_Client.js
 *
 */

var DBService = require("./DBService");

class TFService {
    /**
     * 构造函数，
     */
    constructor() {}

    // 取得所有贸易融资业务量
    async getTFAmount(date) {
        let db = new DBService();
        let sql = "" +
            " select " +
            ";
        db.query(sql, []);
    }

    //todo
}