var DBService = require("./DBService");

/**
 * 一、贸易融资业务量分析。
 *  1、按总行、经营单位，客户，产品等四个层次分析贸易融资的余额信息
 *  2、总行层级以下可以按总量，分业务品种总量，分经营单位业务总量，客户业务总量分析等
 *  3、经营单位层级下可按总量，业务品种分类总量，客户业务分户总量分析等
 *  4、客户层级下可按总量，业务品种分类总量分析等。
 */
class TFBusyService {
    constructor() {
            this.dBService = new DBService();
        }
        //通用查询
    async query(sql, params) {
            return this.dBService.query(sql, params);
        }
        //总行层次的贸易融资业务分析

    /**
     * 查询贸易融资业务的总量
     * @param {查询的业务日期} date 
     */
    async getTotalTFBalance(date) {
        let params = [];
        let sql = +
            "select "+
            "   sum(replace(usx_amount,',','')) as usx_amount, "+
            "   sum(replace(rmx_amount,',','')) as rmb_amount, "+
            "   account_struction as branch "+
            "from  "+
            "   tf_middle_copy1  "+
            "where "+
            "  ";
        
        

        return this.query(sql, params);
    }
}

module.exports = TFBusyService;