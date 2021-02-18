var DBService = require("./../DBService");
const { forEach } = require("mysql2/lib/constants/charset_encodings");

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
     * 查询指定日期段的表内贸易融资每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     */
    async getBNTFBalanceDays(start, end) {
        let params = [start, end, start, end, start, end];
        let sql = `
                    select 
                        t1.date as date,
                        case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
                        case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
                        case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
                        case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb
                    from
                        (
                            select 
                                data_date as date,
                                case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx
                            from
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and 
                                data_date<=?
                                and
                                subject!="0105"
                            group by 
                                data_date
                        )t1 
                        left join 
                        (
                            select
                                data_date as date,
                                case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end amount_usx
                            from
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and 
                                data_date<=?
                                and
                                subject!="0105"
                            group by 
                                data_date
                        )t2 
                        on t1.date=t2.date
                        left join
                        (
                            select
                                data_date as date,
                                case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb
                            from 
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and
                                data_date<=?
                                and 
                                currency="cny"
                                and 
                                subject!="0105"
                            group by 
                                data_date
                        )t3
                        on t2.date=t3.date
            `;
        return await this.query(sql, params);

    }

    /**
     * 查询指定日期段的表外贸易融资每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     */
    async getBWTFBalanceDays(start, end) {
        let params = [start, end, start, end, start, end];
        let sql = `
                    select 
                        t1.date as date,
                        case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
                        case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
                        case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
                        case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb
                    from
                        (
                            select 
                                data_date as date,
                                case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx 
                            from
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and 
                                data_date<=?
                                and
                                subject="0105"
                            group by 
                                data_date
                        )t1 
                        left join 
                        (
                            select
                                data_date as date,
                                case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end amount_usx
                            from
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and 
                                data_date<=?
                                and
                                subject="0105"
                            group by 
                                data_date
                        )t2 
                        on t1.date=t2.date
                        left join
                        (
                            select
                                data_date as date,
                                case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb 
                            from 
                                tf_middle_copy1
                            where
                                data_date>=? 
                                and
                                data_date<=?
                                and 
                                currency="cny"
                                and 
                                subject="0105"
                            group by 
                                data_date
                        )t3
                        on t2.date=t3.date
            `;
        return await this.query(sql, params);

    }

    /**
     * 查询指定日期段内某贸易融资产品的每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     * @param {产品} product 
     */
    async getTFProductBalanceDays(start, end, product) {
        let params = [start, end, product, start, end, product];
        let sql = `
                   
    select 
        t1.date,
        case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else t1.amount_rmx end amount_rmx,
        case when t1.amount_usx is null or t1.amount_usx=0 then 0 else t1.amount_usx end amount_usx,
        case when (t1.amount_rmx-t2.amount_rmb) is null or (t1.amount_rmx-t2.amount_rmb)=0 then 0 else (t1.amount_rmx-t2.amount_rmb) end amount_wzb,
        case when t2.amount_rmb is null or t2.amount_rmb=0 then 0 else t2.amount_rmb end amount_rmb
    FROM 
    (
    select 
            tf_middle_copy1.subject as subject,
            tf_middle_copy1.special_product as special_product,
            tf_middle_copy1.data_date as date,
            convert(sum(replace(rmx_amount,",","")),decimal(20,2)) as amount_rmx,
            convert(sum(replace(usx_amount,",","")),decimal(20,2)) as amount_usx  
    FROM
            tf_middle_copy1
    
    LEFT JOIN
    (
        SELECT
                name,
                subject,
                special
        FROM	
                product_tf
    )product
    ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
    where 
            data_date>= ?
            AND	
            data_date<= ? 
            AND
            product.name= ?
      
            
    GROUP BY
            tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date
    
    )t1
    
    LEFT JOIN
    (
    select 
            tf_middle_copy1.subject as subject,
            tf_middle_copy1.special_product as special_product,
            tf_middle_copy1.data_date as date,
            convert(sum(replace(balance,",","")),decimal(20,2)) as amount_rmb  
    FROM
            tf_middle_copy1
    
    LEFT JOIN
    (
        SELECT
                name,
                subject,
                special
        FROM	
                product_tf
    )product
    ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
    where 
            data_date>= ?
            AND	
            data_date<= ? 
            AND
            product.name= ?
            AND
            currency="cny"
            
    GROUP BY
            tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date
    
    )t2
    
    on t1.subject=t2.subject and t1.special_product=t2.special_product and t1.date=t2.date
 
        
        
        `;
        return await this.query(sql, params);
    }


    /**
     * 查询指定日期段内某一客户某贸易融资产品的每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     * @param {产品} product 
     * @param {客户名称} client 
     */
    async getTFClientProductBalanceDays(start, end, product, client) {
        let params = [start, end, product, client, start, end, product, client];
        let sql = `
                   
    select 
        t1.date,
        case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else t1.amount_rmx end amount_rmx,
        case when t1.amount_usx is null or t1.amount_usx=0 then 0 else t1.amount_usx end amount_usx,
        case when t2.amount_rmb is null or t2.amount_rmb=0 then 0 else t2.amount_rmb end amount_rmb
    FROM 
    (
    select 
            tf_middle_copy1.subject as subject,
            tf_middle_copy1.special_product as special_product,
            tf_middle_copy1.data_date as date,
            convert(sum(replace(rmx_amount,",","")),decimal(20,2)) as amount_rmx,
            convert(sum(replace(usx_amount,",","")),decimal(20,2)) as amount_usx  
    FROM
            tf_middle_copy1
    
    LEFT JOIN
    (
        SELECT
                name,
                subject,
                special
        FROM	
                product_tf
    )product
    ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
    where 
            data_date>= ?
            AND	
            data_date<= ? 
            AND
            product.name= ?
            and
            cust_name = ? 
      
            
    GROUP BY
            tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date
    
    )t1
    
    LEFT JOIN
    (
    select 
            tf_middle_copy1.subject as subject,
            tf_middle_copy1.special_product as special_product,
            tf_middle_copy1.data_date as date,
            convert(sum(replace(balance,",","")),decimal(20,2)) as amount_rmb  
    FROM
            tf_middle_copy1
    
    LEFT JOIN
    (
        SELECT
                name,
                subject,
                special
        FROM	
                product_tf
    )product
    ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
    where 
            data_date>= ?
            AND	
            data_date<= ? 
            AND
            product.name= ?
            AND
            currency="cny"
            and
            cust_name = ? 
            
    GROUP BY
            tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date
    
    )t2
    
    on t1.subject=t2.subject and t1.special_product=t2.special_product and t1.date=t2.date
 
        
        
        `;
        return await this.query(sql, params);
    }

    /**
     * 查询指定日期段内某一客户办理的所有贸易融资产品的每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     * @param {客户名称} client 
     */
    async getTFClientTotalBalanceDays(start, end, client) {
        let params = [start, end, client, start, end, client];
        let sql = `
                                
select 
    t1.date,
    case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else t1.amount_rmx end amount_rmx,
    case when t1.amount_usx is null or t1.amount_usx=0 then 0 else t1.amount_usx end amount_usx,
    case when t2.amount_rmb is null or t2.amount_rmb=0 then 0 else t2.amount_rmb end amount_rmb
FROM 
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(rmx_amount,",","")),decimal(20,2)) as amount_rmx,
        convert(sum(replace(usx_amount,",","")),decimal(20,2)) as amount_usx  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            subject,
            special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        and
        cust_name = ? 
  
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t1

LEFT JOIN
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(balance,",","")),decimal(20,2)) as amount_rmb  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            subject,
            special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        AND
        currency="cny"
        and
        cust_name = ? 
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t2

on t1.subject=t2.subject and t1.special_product=t2.special_product and t1.date=t2.date

        
        
        `;
        return await this.query(sql, params)

    }

    /**
     * 查询指定日期段内某一客户办理的所有表内贸易融资产品的每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     * @param {客户名称} client 
     */
    async getTFClientBNBalanceDays(start, end, client) {
        let params = [start, end, client, start, end, client];
        let sql = `      
        select 
    t1.date,
    case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else t1.amount_rmx end amount_rmx,
    case when t1.amount_usx is null or t1.amount_usx=0 then 0 else t1.amount_usx end amount_usx,
    case when t2.amount_rmb is null or t2.amount_rmb=0 then 0 else t2.amount_rmb end amount_rmb
FROM 
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(rmx_amount,",","")),decimal(20,2)) as amount_rmx,
        convert(sum(replace(usx_amount,",","")),decimal(20,2)) as amount_usx  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            product_tf.subject,
            product_tf.special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        and
        cust_name = ? 
        and
        tf_middle_copy1.subject!="0105"
  
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t1

LEFT JOIN
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(balance,",","")),decimal(20,2)) as amount_rmb  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            subject,
            special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        AND
        currency="cny"
        and
        cust_name = ? 
        and
        tf_middle_copy1.subject!="0105"
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t2

on t1.subject=t2.subject and t1.special_product=t2.special_product and t1.date=t2.date                            

        `;
        return await this.query(sql, params)
    }

    /**
     * 查询指定日期段内某一客户办理的所有表外贸易融资产品的每日余额
     * @param {开始日期} start 
     * @param {结束日期} end 
     * @param {客户名称} client 
     */
    async getTFClientBWBalanceDays(start, end, client) {
        let params = [start, end, client, start, end, client];
        let sql = `                              
select 
    t1.date,
    case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else t1.amount_rmx end amount_rmx,
    case when t1.amount_usx is null or t1.amount_usx=0 then 0 else t1.amount_usx end amount_usx,
    case when t2.amount_rmb is null or t2.amount_rmb=0 then 0 else t2.amount_rmb end amount_rmb
FROM 
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(rmx_amount,",","")),decimal(20,2)) as amount_rmx,
        convert(sum(replace(usx_amount,",","")),decimal(20,2)) as amount_usx  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            product_tf.subject,
            product_tf.special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        and
        cust_name = ? 
        and
        tf_middle_copy1.subject="0105"
  
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t1

LEFT JOIN
(
select 
        tf_middle_copy1.subject as subject,
        tf_middle_copy1.special_product as special_product,
        tf_middle_copy1.data_date as date,
        convert(sum(replace(balance,",","")),decimal(20,2)) as amount_rmb  
FROM
        tf_middle_copy1

LEFT JOIN
(
    SELECT
            name,
            subject,
            special
    FROM	
            product_tf
)product
ON tf_middle_copy1.subject=product.subject and tf_middle_copy1.special_product=product.special
where 
        data_date>= ?
        AND	
        data_date<= ? 
        AND
        currency="cny"
        and
        cust_name = ? 
        and
        tf_middle_copy1.subject="0105"
        
GROUP BY
        tf_middle_copy1.subject,tf_middle_copy1.special_product,tf_middle_copy1.data_date

)t2

on t1.subject=t2.subject and t1.special_product=t2.special_product and t1.date=t2.date    
        `;
        return await this.query(sql, params)

    }

    /**
     * 查询指定日期的贸易融资各项产品的余额
     * @param {string} date 
     */
    async getTFProductsBalanceByDate(start, end) {
        // let lastYear = (date.substring(date, 0, 4) - 1) + "1231";
        let params = [end, end, start, start];
        let sql = `
        select 
            current.name as product_name,
            case when current.balance is null or current.balance=0 then 0 else current.balance end  amount_rmb_c,
            case when current.balance_rmx is null or current.balance_rmx =0 then 0 else current.balance_rmx end amount_rmx_c,
            case when current.balance_usx is null or current.balance_usx =0 then 0 else convert(current.balance_usx,decimal(20,2)) end amount_usx_c,
            case when pre.balance is null or pre.balance =0 then 0 else convert(pre.balance,decimal(20,2)) end amount_rmb_p,
            case when pre.balance_rmx is null or pre.balance_rmx =0 then 0 else convert(pre.balance_rmx,decimal(20,2)) end amount_rmx_p,
            case when pre.balance_usx is null or pre.balance_usx =0 then 0 else convert(pre.balance_usx,decimal(20,2)) end amount_usx_p 
        FROM
            (
                        SELECT 
                            product_tf.name as name,
                            product_tf.SUBJECT AS SUBJECT,
                            product_tf.special AS special,
                            product_tf.type AS type,
                            sum(record2.balance) AS balance,
                            sum(record1.usx_balance) AS balance_usx,
                            sum(record1.rmx_balance) AS balance_rmx 
                        FROM
                            product_tf
                            LEFT JOIN (
                                                    SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                            WHEN sum( REPLACE ( usx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( usx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( usx_amount, ",", "" ) ) 
                                                            END usx_balance,
                                                    CASE
                                                            WHEN sum( REPLACE ( rmx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( rmx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( rmx_amount, ",", "" ) ) 
                                                            END rmx_balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ? 
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                                                ) record1 
                            ON 	product_tf.SUBJECT = record1.SUBJECT 
                                    AND product_tf.special = record1.special_product
                            left join 
                            (
                                                SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                        WHEN sum( REPLACE ( balance, ",", "" ) ) IS NULL 
                                                        OR sum( REPLACE ( balance, ",", "" ) ) = 0 THEN
                                                            0 ELSE sum( REPLACE ( balance, ",", "" ) ) 
                                                        END balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ?
                                                        and 
                                                        currency="cny" 
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                            )record2
                            on record1.subject=record2.subject and record1.special_product = record2.special_product
                        GROUP BY 
                                product_tf.name
            )current
        left join 
            (
            SELECT 
                product_tf.name as name,
                product_tf.SUBJECT AS SUBJECT,
                product_tf.special AS special,
                product_tf.type AS type,
                sum(record2.balance) AS balance,
                sum(record1.usx_balance) AS balance_usx,
                sum(record1.rmx_balance) AS balance_rmx 
            FROM
                product_tf
                LEFT JOIN (
                                        SELECT
                                            tf_middle_copy1.SUBJECT,
                                            tf_middle_copy1.special_product,
                                        CASE	
                                                WHEN sum( REPLACE ( usx_amount, ",", "" ) ) IS NULL 
                                                OR sum( REPLACE ( usx_amount, ",", "" ) ) = 0 THEN
                                                    0 ELSE sum( REPLACE ( usx_amount, ",", "" ) ) 
                                                END usx_balance,
                                        CASE
                                                WHEN sum( REPLACE ( rmx_amount, ",", "" ) ) IS NULL 
                                                OR sum( REPLACE ( rmx_amount, ",", "" ) ) = 0 THEN
                                                    0 ELSE sum( REPLACE ( rmx_amount, ",", "" ) ) 
                                                END rmx_balance 
                                        FROM
                                            tf_middle_copy1 
                                        WHERE
                                            tf_middle_copy1.data_date = ? 
                                        GROUP BY
                                            SUBJECT,
                                            special_product 
                                    ) record1 
                ON 	product_tf.SUBJECT = record1.SUBJECT 
                        AND product_tf.special = record1.special_product
                left join 
                (
                                    SELECT
                                            tf_middle_copy1.SUBJECT,
                                            tf_middle_copy1.special_product,
                                        CASE	
                                            WHEN sum( REPLACE ( balance, ",", "" ) ) IS NULL 
                                            OR sum( REPLACE ( balance, ",", "" ) ) = 0 THEN
                                                0 ELSE sum( REPLACE ( balance, ",", "" ) ) 
                                            END balance 
                                        FROM
                                            tf_middle_copy1 
                                        WHERE
                                            tf_middle_copy1.data_date = ?
                                            and 
                                            currency="cny" 
                                        GROUP BY
                                            SUBJECT,
                                            special_product 
                )record2
                on record1.subject=record2.subject and record1.special_product = record2.special_product
            GROUP BY 
                    product_tf.name
            )pre
        on  current.name=pre.name
        
            `;
        return await this.query(sql, params);

    }


    // 取得最近的贸易融资业务记录日期
    async getLastTFDate() {
        let sql = `select data_date from tf_middle_copy1 order by data_date desc limit 1`;
        return await this.query(sql, []);
    }


    /**
     * 查询指定日期各个客户的表内贸易融资的余额
     * @param {string} date 
     */
    async getClientsBNTFBalanceByDate(start, end) {
        let params = [end, end, end, start, start, start];
        let sql = `

    select 
        current.cust_name,
        current.amount_rmx as amount_rmx_c,
        current.amount_usx as amount_usx_c,
        current.amount_wzb as amount_wzb_c,
        current.amount_rmb as amount_rmb_c,
        pre.amount_rmx as amount_rmx_p,
        pre.amount_usx as amount_usx_p,
        pre.amount_wzb as amount_wzb_p,
        pre.amount_rmb as amount_rmb_p 
    from
    (
        select 
            t1.cust_name as cust_name,
            case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
            case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
            case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
            case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb  
        from
            (
                select 
                    
                    cust_name as cust_name,
                    case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx
                from
                    tf_middle_copy1 
                where
                    data_date=? 
                    and
                    subject!="0105"
                group by 
                    cust_name
            )t1 
            left join 
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end  amount_usx
                from
                    tf_middle_copy1
                where
                    data_date=?
                    and
                    subject!="0105"
                group by 
                    cust_name 
            )t2 
            on t1.cust_name=t2.cust_name
            left join
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb 
                from 
                    tf_middle_copy1
                where
                    data_date=?
                    and 
                    currency="cny"
                    and 
                    subject!="0105"
                group by 
                    cust_name 
            )t3
            on t2.cust_name=t3.cust_name
    )current 
    left join 
    (
        select 
            t1.cust_name as cust_name,
            case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
            case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
            case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
            case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb  
        from
            (
                select 
                    
                    cust_name as cust_name,
                    case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx
                from
                    tf_middle_copy1 
                where
                    data_date=? 
                    and
                    subject!="0105"
                group by 
                    cust_name
            )t1 
            left join 
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end  amount_usx
                from
                    tf_middle_copy1
                where
                    data_date=?
                    and
                    subject!="0105"
                group by 
                    cust_name 
            )t2 
            on t1.cust_name=t2.cust_name
            left join
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb 
                from 
                    tf_middle_copy1
                where
                    data_date=?
                    and 
                    currency="cny"
                    and 
                    subject!="0105"
                group by 
                    cust_name 
            )t3
            on t2.cust_name=t3.cust_name
    )pre
    on current.cust_name=pre.cust_name 
    order by amount_rmx_c desc
       
        `;
        return await this.query(sql, params);

    }


    /**
     * 查询指定日期各个客户的表外贸易融资的余额
     * @param {string} date 
     */
    async getClientsBWTFBalanceByDate(start, end) {
        let params = [end, end, end, start, start, start];
        let sql = `
    
    select 
        current.cust_name,
        current.amount_rmx as amount_rmx_c,
        current.amount_usx as amount_usx_c,
        current.amount_wzb as amount_wzb_c,
        current.amount_rmb as amount_rmb_c,
        pre.amount_rmx as amount_rmx_p,
        pre.amount_usx as amount_usx_p,
        pre.amount_wzb as amount_wzb_p,
        pre.amount_rmb as amount_rmb_p 
    from
    (
        select 
            t1.cust_name as cust_name,
            case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
            case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
            case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
            case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb  
        from
            (
                select 
                    
                    cust_name as cust_name,
                    case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx
                from
                    tf_middle_copy1 
                where
                    data_date=? 
                    and
                    subject="0105"
                group by 
                    cust_name
            )t1 
            left join 
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end  amount_usx
                from
                    tf_middle_copy1
                where
                    data_date=?
                    and
                    subject="0105"
                group by 
                    cust_name 
            )t2 
            on t1.cust_name=t2.cust_name
            left join
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb 
                from 
                    tf_middle_copy1
                where
                    data_date=?
                    and 
                    currency="cny"
                    and 
                    subject="0105"
                group by 
                    cust_name 
            )t3
            on t2.cust_name=t3.cust_name
    )current 
    left join 
    (
        select 
            t1.cust_name as cust_name,
            case when t1.amount_rmx is null or t1.amount_rmx=0 then 0 else convert(t1.amount_rmx,decimal(20,2)) end amount_rmx,
            case when t2.amount_usx is null or t2.amount_usx=0 then 0 else convert(t2.amount_usx,decimal(20,2)) end amount_usx,
            case when t3.amount_rmb is null or t3.amount_rmb=0 then 0 else convert(t3.amount_rmb,decimal(20,2)) end amount_rmb,
            case when t1.amount_rmx-t3.amount_rmb is null or (t1.amount_rmx-t3.amount_rmb)=0 then 0 else convert(t1.amount_rmx-t3.amount_rmb,decimal(20,2)) end amount_wzb  
        from
            (
                select 
                    
                    cust_name as cust_name,
                    case when sum(replace(rmx_amount,",","")) is null or sum(replace(rmx_amount,",",""))=0 then 0 else sum(replace(rmx_amount,",","")) end amount_rmx
                from
                    tf_middle_copy1 
                where
                    data_date=? 
                    and
                    subject="0105"
                group by 
                    cust_name
            )t1 
            left join 
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(usx_amount,",","")) is null or sum(replace(usx_amount,",",""))=0 then 0 else sum(replace(usx_amount,",","")) end  amount_usx
                from
                    tf_middle_copy1
                where
                    data_date=?
                    and
                    subject="0105"
                group by 
                    cust_name 
            )t2 
            on t1.cust_name=t2.cust_name
            left join
            (
                select
                    
                    cust_name as cust_name,
                    case when sum(replace(balance,",","")) is null or sum(replace(balance,",",""))=0 then 0 else sum(replace(balance,",","")) end amount_rmb 
                from 
                    tf_middle_copy1
                where
                    data_date=?
                    and 
                    currency="cny"
                    and 
                    subject="0105"
                group by 
                    cust_name 
            )t3
            on t2.cust_name=t3.cust_name
    )pre
    on current.cust_name=pre.cust_name 
    order by amount_rmx_c desc
       
        `;
        return await this.query(sql, params);

    }

    async getFunction() {

    }


    async getTFProductClientBalanceDays(start, end, product, client) {
        let params = [start, end, product, client, start, end, product, client];
        let sql = `

        select 
        t1.product_name as product_name,
        t1.cust_name as cust_name,
        t1.data_date as date,
        case 
            when t1.amount_rmx is null or t1.amount_rmx=0 then 0
            else convert(t1.amount_rmx,decimal(20,2)) 
        end amount_rmx,
        case 
            when t1.amount_usx is null or t1.amount_usx=0 then 0
            else convert(t1.amount_usx,decimal(20,2)) 
        end amount_usx,
        case 
            when t2.amount_rmb is null or t2.amount_rmb=0 then 0
            else convert(t2.amount_rmb,decimal(20,2)) 
        end amount_rmb 
    FROM
                        (
                        select 
                            pt.name as product_name,
                            tf_middle_copy1.cust_name as cust_name,
                            tf_middle_copy1.subject,
                            tf_middle_copy1.special_product,
                            tf_middle_copy1.data_date as data_date,
                            sum(replace(rmx_amount,",","")) as amount_rmx ,
                            sum(replace(usx_amount,",","")) as amount_usx 	
                        FROM
                            tf_middle_copy1
                        left join
                            (
                                select
                                    name,
                                    subject,
                                    special 
                                FROM
                                    product_tf
                            )pt
                            on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
    where 
            data_date>=?
                    and
            data_date<=?
                    and
            pt.name=?
                    and 
            cust_name=?
    GROUP BY
            cust_name ,data_date
    )t1
    left join
    (
                select
                    pt.name as product_name,
                    tf_middle_copy1.cust_name as cust_name,
                    tf_middle_copy1.subject,
                    tf_middle_copy1.data_date as data_date,
                    tf_middle_copy1.special_product,
                    sum(replace(balance,",","")) as amount_rmb 	
                FROM
                    tf_middle_copy1
                left join
                    (
                        select
                            name,
                            subject,
                            special 
                        FROM
                            product_tf
                    )pt
                    on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
                    where 
                        data_date>=?
                                and
                        data_date<=?
                                and
                        currency="cny" 
                                and
                        pt.name=?
                                and 
                        cust_name=?
                    GROUP BY
                        cust_name ,data_date
    )t2
    on t1.cust_name=t2.cust_name and t1.data_date=t2.data_date
    ORDER BY t1.data_date desc
    
    

        
        
        
        `;
        return await this.query(sql, params);

    }


    /**
     * 查询单项贸易融资产品的办理客户
     * @param {查询日期} date 
     */
    async getTFProductClientsBalanceByDate(start, end, product) {
        let params = [end, product, end, product, start, product, start, product];
        let sql = `
select 
	current.product_name as product_name,
	case when current.cust_name is null then pre.cust_name else current.cust_name end cust_name,
	case when current.amount_rmx is null or current.amount_rmx=0 then 0 else convert(current.amount_rmx,decimal(20,2)) end amount_rmx_c,
	case when current.amount_usx is null or current.amount_usx=0 then 0 else convert(current.amount_usx,decimal(20,2)) end amount_usx_c,
	case when current.amount_rmb is null or current.amount_rmb=0 then 0 else convert(current.amount_rmb,decimal(20,2)) end amount_rmb_c,
	case when (current.amount_rmx-current.amount_rmb) is null or (current.amount_rmx-current.amount_rmb)=0 then 0 else convert((current.amount_rmx-current.amount_rmb),decimal(20,2)) end amount_wzb_c,
	
	
	case when pre.amount_rmx is null or pre.amount_rmx=0 then 0 else convert(pre.amount_rmx,decimal(20,2)) end amount_rmx_p,
	case when pre.amount_usx is null or pre.amount_usx=0 then 0 else convert(pre.amount_usx,decimal(20,2)) end amount_usx_p,
	case when pre.amount_rmb is null or pre.amount_rmb=0 then 0 else convert(pre.amount_rmb,decimal(20,2)) end amount_rmb_p,
	case when (pre.amount_rmx-pre.amount_rmb) is null or (pre.amount_rmx-pre.amount_rmb)=0 then 0 else convert((pre.amount_rmx-pre.amount_rmb),decimal(20,2)) end amount_wzb_p


FROM
(
select 
	t1.product_name as product_name,
	t1.cust_name as cust_name,
	t1.amount_rmx as amount_rmx,
	t1.amount_usx as amount_usx,
	t2.amount_rmb as amount_rmb
FROM
(
select 
	pt.name as product_name,
	tf_middle_copy1.cust_name as cust_name,
	tf_middle_copy1.subject,
	tf_middle_copy1.special_product,
	sum(replace(rmx_amount,",","")) as amount_rmx ,
	sum(replace(usx_amount,",","")) as amount_usx 	
FROM
	tf_middle_copy1
left join
	(
		select
			name,
			subject,
			special 
		FROM
			product_tf
	)pt
	on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
	where 
		data_date=?
		and
		pt.name=?
	GROUP BY
		cust_name 
)t1
left join
(
select
	pt.name as product_name,
	tf_middle_copy1.cust_name as cust_name,
	tf_middle_copy1.subject,
	tf_middle_copy1.special_product,
	sum(replace(balance,",","")) as amount_rmb 	
FROM
	tf_middle_copy1
left join
	(
		select
			name,
			subject,
			special 
		FROM
			product_tf
	)pt
	on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
	where 
		data_date=?
				and
		currency="cny" 
				and
		pt.name=?
	GROUP BY
		cust_name 
)t2
on t1.cust_name=t2.cust_name
)current

left join 

(
select 
	t1.product_name as product_name,
	t1.cust_name as cust_name,
	t1.amount_rmx as amount_rmx,
	t1.amount_usx as amount_usx,
	t2.amount_rmb as amount_rmb
FROM
(
select 
	pt.name as product_name,
	tf_middle_copy1.cust_name as cust_name,
	tf_middle_copy1.subject,
	tf_middle_copy1.special_product,
	sum(replace(rmx_amount,",","")) as amount_rmx ,
	sum(replace(usx_amount,",","")) as amount_usx 	
FROM
	tf_middle_copy1
left join
	(
		select
			name,
			subject,
			special 
		FROM
			product_tf
	)pt
	on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
	where 
		data_date=?
		and
		pt.name=?
	GROUP BY
		cust_name 
)t1
left join
(
select
	pt.name as product_name,
	tf_middle_copy1.cust_name as cust_name,
	tf_middle_copy1.subject,
	tf_middle_copy1.special_product,
	sum(replace(balance,",","")) as amount_rmb 	
FROM
	tf_middle_copy1
left join
	(
		select
			name,
			subject,
			special 
		FROM
			product_tf
	)pt
	on tf_middle_copy1.subject=pt.subject and tf_middle_copy1.special_product=pt.special
	where 
		data_date=?
				and
		currency="cny" 
				and
		pt.name=?
	GROUP BY
		cust_name 
)t2
on t1.cust_name=t2.cust_name
)pre

on current.cust_name=pre.cust_name
    
            
 
        `;
        return await this.query(sql, params);
    }

    /**
     * 取得某一时点客户的办理贸易融资产品的分类余额
     * @param {*} date    查询的日期
     * @param {*} client  客户名称
     */
    async getClientTFProductsBalanceByDate(date, client) {
        let lastYear = (date.substring(date, 0, 4) - 1) + "1231";
        let params = [date, client, date, client, lastYear, client, lastYear, client];
        let sql = `
        select 

            current.name,
            case when current.balance is null or current.balance=0 then 0 else convert(current.balance,decimal(20,2)) end  amount_rmb_c,
            case when current.balance_rmx is null or current.balance_rmx =0 then 0 else convert(current.balance_rmx,decimal(20,2)) end amount_rmx_c,
            case when current.balance_usx is null or current.balance_usx =0 then 0 else convert(current.balance_usx,decimal(20,2)) end amount_usx_c,
            case when pre.balance is null or pre.balance =0 then 0 else convert(pre.balance,decimal(20,2)) end amount_rmb_p,
            case when pre.balance_rmx is null or pre.balance_rmx =0 then 0 else convert(pre.balance_rmx,decimal(20,2)) end amount_rmx_p,
            case when pre.balance_usx is null or pre.balance_usx =0 then 0 else convert(pre.balance_usx,decimal(20,2)) end amount_usx_p 

        FROM
            (
                        SELECT 
                            product_tf.name as name,
                            product_tf.SUBJECT AS SUBJECT,
                            product_tf.special AS special,
                            product_tf.type AS type,
                            sum(record2.balance) AS balance,
                            sum(record1.usx_balance) AS balance_usx,
                            sum(record1.rmx_balance) AS balance_rmx 
                        FROM
                            product_tf
                            LEFT JOIN (
                                                    SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                            WHEN sum( REPLACE ( usx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( usx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( usx_amount, ",", "" ) ) 
                                                            END usx_balance,
                                                    CASE
                                                            WHEN sum( REPLACE ( rmx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( rmx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( rmx_amount, ",", "" ) ) 
                                                            END rmx_balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ?  
                                                        and  
                                                        cust_name =?
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                                                ) record1 
                            ON 	product_tf.SUBJECT = record1.SUBJECT 
                                    AND product_tf.special = record1.special_product
                            left join 
                            (
                                                SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                        WHEN sum( REPLACE ( balance, ",", "" ) ) IS NULL 
                                                        OR sum( REPLACE ( balance, ",", "" ) ) = 0 THEN
                                                            0 ELSE sum( REPLACE ( balance, ",", "" ) ) 
                                                        END balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ?
                                                        and 
                                                        currency="cny" 
                                                        and  
                                                        cust_name = ? 
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                            )record2
                            on record1.subject=record2.subject and record1.special_product = record2.special_product
                        GROUP BY 
                                product_tf.name
            )current
        left join 
            (
                        SELECT 
                            product_tf.name as name,
                            product_tf.SUBJECT AS SUBJECT,
                            product_tf.special AS special,
                            product_tf.type AS type,
                            sum(record2.balance) AS balance,
                            sum(record1.usx_balance) AS balance_usx,
                            sum(record1.rmx_balance) AS balance_rmx 
                        FROM
                            product_tf
                            LEFT JOIN (
                                                    SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                            WHEN sum( REPLACE ( usx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( usx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( usx_amount, ",", "" ) ) 
                                                            END usx_balance,
                                                    CASE
                                                            WHEN sum( REPLACE ( rmx_amount, ",", "" ) ) IS NULL 
                                                            OR sum( REPLACE ( rmx_amount, ",", "" ) ) = 0 THEN
                                                                0 ELSE sum( REPLACE ( rmx_amount, ",", "" ) ) 
                                                            END rmx_balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ?
                                                        and  
                                                        cust_name = ? 
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                                                ) record1 
                            ON 	product_tf.SUBJECT = record1.SUBJECT 
                                    AND product_tf.special = record1.special_product
                            left join 
                            (
                                                SELECT
                                                        tf_middle_copy1.SUBJECT,
                                                        tf_middle_copy1.special_product,
                                                    CASE	
                                                        WHEN sum( REPLACE ( balance, ",", "" ) ) IS NULL 
                                                        OR sum( REPLACE ( balance, ",", "" ) ) = 0 THEN
                                                            0 ELSE sum( REPLACE ( balance, ",", "" ) ) 
                                                        END balance 
                                                    FROM
                                                        tf_middle_copy1 
                                                    WHERE
                                                        tf_middle_copy1.data_date = ? 
                                                        and 
                                                        currency="cny" 
                                                        and  
                                                        cust_name = ? 
                                                    GROUP BY
                                                        SUBJECT,
                                                        special_product 
                            )record2
                            on record1.subject=record2.subject and record1.special_product = record2.special_product
                        GROUP BY 
                                product_tf.name
            )pre
        on  current.name=pre.name
        
            `;
        return await this.query(sql, params);

    }

}

module.exports = TFBusyService;