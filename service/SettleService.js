var mysql = require('./mysqlService');


var conn = mysql.connection();
class settleService {
    constructor() {
        //this.connection = mysql.connection();
    };

    getLastBusyDate(cb) {
        let sqlString = "select busy_date from settle_record order by busy_date desc limit 1";
        conn.query(sqlString, function(err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(rows);
            }
        });
    };
    getBusyRecord(cb) {
        let sqlString = "select * from settle_record order by busy_date desc limit 10";
        conn.query(sqlString, function(err, rows, fields) {
            if (err) {
                cb(err);
            } else {
                cb(rows);
            }
        });
    };

    /**
     * get all unit settle performance
     * @param {Object} params {products,start,end}
     * @param {callback} cb  return rows if success else err
     */
    getUnitSettlePerformance(params) {
        return new Promise(function(resolve, reject) {
            let sqlString =
                " select belong_Branch_Code as 行号," +
                //" select " +
                " belong_branch_name as 行名," +
                " sum(busy_amount*usd_rate)/10000 as 金额," +
                " count(busy_date) as 笔数 " +
                " from settle_record " +
                " where " +
                " product_name in (?) " +
                " and " +
                " busy_date>=? and busy_date<=?" +
                " group by 行号 ";
            conn.query(sqlString, params, function(err, rows, fields) {
                if (err) {

                    resolve(err);
                } else {
                    resolve({ err, rows, fields });
                }
            });

        });
    };

    /**
     * 取得所有国际结算量统计口径的产品
     */
    getSettleRangeProduct() {
        return new Promise(function(resolve, reject) {
            let sqlString =
                "select name from product where settleRange=1";
            conn.query(sqlString, function(err, rows, fields) {
                if (err) {
                    resolve(err);
                } else {
                    let products = [];
                    for (let e in rows) {
                        products.push(rows[e].name);
                    }
                    resolve({ err, products, fields });
                }
            });
        });


    };
}


module.exports = settleService;