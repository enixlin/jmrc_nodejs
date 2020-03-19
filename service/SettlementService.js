var DBService = require("./DBService");

class SettlementSerive {
  constructor() {
    this.dBService = new DBService();
  }

  async query(sql, params) {
    return this.dBService.query(sql, params);
  }
  async querys(querys) {
    return await this.dBService.querys(querys);
  }

  async testTransaction() {
    let tasks = [];
    tasks.push({
      sql: "update balance set balance=balance-20 where id=1",
      params: []
    });
    tasks.push({
      sql: "update balance1 set balance=balance+20 where id=2",
      params: []
    });
    return await this.querys(tasks);
  }

  /**
   * 取得全行各个国际结算产品的结算量
   getTotalRangeProductSettlement

   * @param {*} start 
   * @param {*} end 
   */
  async getTotalRangeProductSettlement(start, end) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    console.log(product);
    let sql =
      " ( select  " +
      " case when c.product_name is null then p.product_name else c.product_name end name, " +
      "case when c.amount is null or c.amount=0 then 0 else CONVERT(c.amount,DECIMAL(20,2)) end amount_c," +
      "case when c.times is null or c.times=0 then 0 else CONVERT(c.times,DECIMAL(20,2)) end times_c, " +
      "case when p.amount is null or p.amount=0 then 0 else CONVERT(p.amount,DECIMAL(20,2)) end amount_p," +
      "case when p.times is null or p.times=0 then 0 else CONVERT(p.times,DECIMAL(20,2)) end times_p " +
      " from  " +
      "(" +
      "select " +
      "product_name,  " +
      "convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "count( product_name) as times   " +
      " from " +
      " settle_record  " +
      " where   " +
      "  busy_date>=? and busy_date<=? and product_name in ?   " +
      "  group by product_name   " +
      "  ) c   " +
      " left join " +
      " ( " +
      "select " +
      "product_name,  " +
      "convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "count( product_name) as times  " +
      " from " +
      " settle_record  " +
      " where   " +
      "  busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "  and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "  and product_name in ?   " +
      "  group by product_name   " +
      "  ) p   " +
      "  on c.product_name=p.product_name )" +
      " union " +
      " ( select  " +
      " case when p.product_name is null then c.product_name else p.product_name end name, " +
      "case when c.amount is null or c.amount=0 then 0 else CONVERT(c.amount,DECIMAL(20,2)) end amount_c," +
      "case when c.times is null or c.times=0 then 0 else CONVERT(c.times,DECIMAL(20,2)) end times_c, " +
      "case when p.amount is null or p.amount=0 then 0 else CONVERT(p.amount,DECIMAL(20,2)) end amount_p," +
      "case when p.times is null or p.times=0 then 0 else CONVERT(p.times,DECIMAL(20,2)) end times_p " +
      " from  " +
      "(" +
      "select " +
      "product_name,  " +
      "convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "count( product_name) as times   " +
      " from " +
      " settle_record  " +
      " where   " +
      "  busy_date>=? and busy_date<=? and product_name in ?   " +
      "  group by product_name   " +
      "  ) c   " +
      " right join " +
      " ( " +
      "select " +
      "product_name,  " +
      "convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "count( product_name) as times  " +
      " from " +
      " settle_record  " +
      " where   " +
      "  busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "  and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "  and product_name in ?   " +
      "  group by product_name   " +
      "  ) p   " +
      "  on c.product_name=p.product_name )";
    return this.query(sql, [
      start,
      end,
      [product],
      start,
      end,
      [product],
      start,
      end,
      [product],
      start,
      end,
      [product]
    ]);
  }
  //取得全行所有经营单位的国际结算量
  async getTotalUnitSettle(start, end) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    let sql =
      " (" +
      " select " +
      " case when c.belong_branch_code is null then p.belong_branch_code else c.belong_branch_code end belong_branch_code, " +
      " case when c.belong_branch_name is null then p.belong_branch_name else c.belong_branch_name end belong_branch_name, " +
      " case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      " case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      " case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      " case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     group by belong_branch_code   " +
      " ) c   " +
      " left join    " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     group by belong_branch_code   " +
      " ) p   " +
      " on c.belong_branch_code=p.belong_branch_code  " +
      " ) " +
      " union " +
      " (" +
      " select " +
      " case when p.belong_branch_code is null then c.belong_branch_code else p.belong_branch_code end belong_branch_code, " +
      " case when p.belong_branch_name is null then c.belong_branch_name else p.belong_branch_name end belong_branch_name, " +
      " case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      " case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      " case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      " case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     group by belong_branch_code   " +
      " ) c   " +
      " right join    " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     group by belong_branch_code   " +
      " ) p   " +
      " on c.belong_branch_code=p.belong_branch_code  " +
      " ) ";

    return this.query(sql, [
      start,
      end,
      [product],
      start,
      end,
      [product],
      start,
      end,
      [product],
      start,
      end,
      [product]
    ]);
  }
  /**
   * 取得全行国际结算量分月统计量
   */
  async getTotalMonthSettle(start, end) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    let sql =
      "" +
      " select " +
      " c.month as month,  " +
      " case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c,  " +
      " case when  c.times is null then 0 else c.times end times_c,  " +
      " case when p.amount is null then 0 else p.amount end amount_p,  " +
      " case when p.times is null then 0 else p.times end times_p   " +
      " from   " +
      " ( select " +
      " left(busy_date,6) as month, " +
      " convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      " count( product_name) as times  " +
      " from   " +
      " settle_record    " +
      " where     " +
      "  busy_date>=? and busy_date<=? and product_name in ?   " +
      "  group by month   ) c" +
      "  left join  " +
      " ( select " +
      " left(date_format(date_add(busy_date,interval  +1 YEAR),'%Y%m%d' ),6) as month, " +
      " convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      " count( product_name) as times  " +
      " from   " +
      " settle_record    " +
      " where     " +
      "  busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' ) " +
      " and busy_date <=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )" +
      " and product_name in ? " +
      "  group by month   ) p " +
      "  on c.month=p.month " +
      "  order by month desc " +
      "";
    return this.query(sql, [start, end, [product], start, end, [product]]);
  }

  /**
   *取得全行查询时间段间的国际结算总量
   * @param {*} product
   */
  async getTotalSettle(start, end) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    console.log(product);
    let sql =
      "select  " +
      "   convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount " +
      " from " +
      "   settle_record  where busy_date>=? and busy_date<=? and product_name in ? ";
    return this.query(sql, [start, end, [product]]);
  }

  /**
   *取得支行的国际结算量
   * @param {*} product
   */
  async getUnitSettle(start, end, unit) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    console.log(product);
    let sql =
      "" +
      " select " +
      "   c.belong_branch_code, " +
      "   c.belong_branch_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?   " +
      "     group by belong_branch_code   " +
      " ) c   " +
      " left join    " +
      " ( select " +
      "     belong_branch_code, " +
      "     belong_branch_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?   " +
      "     group by belong_branch_code   " +
      " ) p   " +
      " on c.belong_branch_code=p.belong_branch_code  ";
    return this.query(sql, [
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit
    ]);
  }

  /**
   * 取得支行国际结算量分月统计量
   */
  async getUnitMonthSettle(start, end, unit) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }
    let sql =
      "" +
      " select " +
      "   c.month as month,  " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c,  " +
      "   case when  c.times is null then 0 else c.times end times_c,  " +
      "   case when p.amount is null then 0 else p.amount end amount_p,  " +
      "   case when p.times is null then 0 else p.times end times_p   " +
      " from   " +
      " ( select " +
      "   left(busy_date,6) as month, " +
      "   convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      "   count( product_name) as times  " +
      " from   " +
      "   settle_record    " +
      " where     " +
      "   busy_date>=? " +
      "   and busy_date<=? " +
      "   and product_name in ?   " +
      "   and belong_branch_code = ? " +
      "  group by month   ) c" +
      "  left join  " +
      " ( select " +
      "   left(date_format(date_add(busy_date,interval  +1 YEAR),'%Y%m%d' ),6) as month, " +
      "   convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      "   count( product_name) as times  " +
      " from   " +
      "   settle_record    " +
      " where     " +
      "   busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' ) " +
      "   and busy_date <=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )" +
      "   and product_name in ? " +
      "   and belong_branch_code = ? " +
      " group by month   ) p " +
      " on c.month=p.month " +
      " order by month desc " +
      "";
    return this.query(sql, [
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit
    ]);
  }

  // getUnitCientSettle
  /**
   * 取得支行各个客户的国际结算量
   * @param {*} product
   */
  async getUnitCientSettle(start, end, unit) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }

    let sql =
      "" +
      " ( " +
      " select  " +
      "   case when c.cust_number is null  then p.cust_number else c.cust_number end cust_number, " +
      "   case when c.cust_name is null  then p.cust_name else c.cust_name end cust_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by cust_number  " +
      " ) c   " +
      " left join    " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by cust_number   " +
      " ) p   " +
      " on c.cust_number=p.cust_number  " +
      " ) " +
      " union " +
      " ( " +
      " select  " +
      "   case when p.cust_number is null  then c.cust_number else p.cust_number end cust_number, " +
      "   case when p.cust_name is null  then c.cust_name else p.cust_name end cust_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by cust_number  " +
      " ) c   " +
      " right join    " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by cust_number   " +
      " ) p   " +
      " on c.cust_number=p.cust_number  " +
      " ) ";

    return this.query(sql, [
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit
    ]);
  }

  // getUnitRangeProductSettlement
  /**
   * 取得支行各个国际结算产品的国际结算量
   * @param {*} product
   */
  async getUnitRangeProductSettlement(start, end, unit) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }

    let sql =
      "" +
      " ( " +
      " select  " +
      "   case when c.product_name is null  then p.product_name else c.product_name end product_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by product_name  " +
      " ) c   " +
      " left join    " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by product_name   " +
      " ) p   " +
      " on c.product_name=p.product_name  " +
      " ) " +
      " union " +
      " ( " +
      " select  " +
      "   case when p.product_name is null  then c.product_name else p.product_name end product_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by product_name  " +
      " ) c   " +
      " right join    " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and belong_branch_code= ?  " +
      "     group by product_name   " +
      " ) p   " +
      " on c.product_name=p.product_name  " +
      " ) ";

    return this.query(sql, [
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit,
      start,
      end,
      [product],
      unit
    ]);
  }

  // getUnitRangeProductSettlement
  /**
   * 取得单个客户的国际结算量
   * @param {*} product
   */
  async getClientSettle(start, end, client) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }

    let sql =
      "" +
      " select " +
      "     c.cust_number," +
      "     c.cust_name," +
      "     case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c," +
      "     case when c.times is null or c.times=0 then 0 else c.times end times_c," +
      "     case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p," +
      "     case when p.times is null or p.times=0 then 0 else p.times end times_p" +
      " from  " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum(usd_rate*busy_amount),decimal(15,2)) as amount, " +
      "     count(busy_date) as times " +
      " from" +
      "     settle_record " +
      " where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by cust_number  " +
      " ) c " +
      " left join " +
      " ( " +
      " select " +
      "     cust_number, " +
      "     cust_name, " +
      "     convert(sum(usd_rate*busy_amount),decimal(15,2)) as amount, " +
      "     count(busy_date) as times " +
      " from" +
      "     settle_record " +
      " where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by cust_number  " +
      " ) p " +
      " on c.cust_number=p.cust_number ";

    return this.query(sql, [
      start,
      end,
      [product],
      client,
      start,
      end,
      [product],
      client
    ]);
  }

  // getUnitRangeProductSettlement
  /**
   * 取得客户国际结算量分月统计量
   * @param {*} product
   */
  async getClientMonthSettle(start, end, client) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }

    let sql =
      "" +
      "" +
      " select " +
      "     c.month as month,  " +
      "     case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c,  " +
      "     case when  c.times is null then 0 else c.times end times_c,  " +
      "     case when p.amount is null then 0 else p.amount end amount_p,  " +
      "     case when p.times is null then 0 else p.times end times_p   " +
      " from   " +
      " (  " +
      "    select " +
      "       left(busy_date,6) as month, " +
      "       convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      "       count( product_name) as times  " +
      "   from   " +
      "       settle_record    " +
      "   where     " +
      "       busy_date>=?    " +
      "       and busy_date<=?  " +
      "       and product_name in ?   " +
      "       and cust_number = ?   " +
      "   group by month   " +
      " ) c" +
      "  left join  " +
      " (  " +
      "    select " +
      "       left(date_format(date_add(busy_date,interval  +1 YEAR),'%Y%m%d' ),6) as month, " +
      "       convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount, " +
      "       count( product_name) as times  " +
      "   from   " +
      "       settle_record    " +
      "   where     " +
      "       busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' ) " +
      "     and busy_date <=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )" +
      "     and product_name in ? " +
      "     and cust_number=  ? " +
      "  group by month    " +
      " ) p " +
      "  on c.month=p.month " +
      "  order by month desc " +
      "";

    return this.query(sql, [
      start,
      end,
      [product],
      client,
      start,
      end,
      [product],
      client
    ]);
  }

  // getUnitRangeProductSettlement
  /**
   * 取得客户的各国际结算产品的统计量
   * @param {*} product
   */
  async getClientRangeProductSettlement(start, end, client) {
    let product = [];
    let products = await this.getSettleRangeProductsName();
    for (const p of products) {
      product.push(p.name);
    }

    let sql =
      "" +
      " ( " +
      " select  " +
      "   case when c.product_name is null  then p.product_name else c.product_name end product_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by product_name  " +
      " ) c   " +
      " left join    " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by product_name   " +
      " ) p   " +
      " on c.product_name=p.product_name  " +
      " ) " +
      " union " +
      " ( " +
      " select  " +
      "   case when p.product_name is null  then c.product_name else p.product_name end product_name, " +
      "   case when c.amount is null or c.amount=0 then 0 else c.amount end amount_c, " +
      "   case when c.times is null or c.times=0 then 0 else c.times end times_c, " +
      "   case when p.amount is null or p.amount=0 then 0 else p.amount end amount_p, " +
      "   case when p.times is null or p.times=0 then 0 else p.times end times_p " +
      " from " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=?  " +
      "     and busy_date<=?   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by product_name  " +
      " ) c   " +
      " right join    " +
      " ( " +
      " select " +
      "     product_name, " +
      "     convert(sum( usd_rate * busy_amount ),decimal(15,2)) as amount,  " +
      "     count( product_name) as times   " +
      "   from  " +
      "     settle_record " +
      "   where " +
      "     busy_date>=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and busy_date<=date_format(date_add(?,interval  -1 YEAR),'%Y%m%d' )   " +
      "     and product_name in ?   " +
      "     and cust_number= ?  " +
      "     group by product_name   " +
      " ) p   " +
      " on c.product_name=p.product_name  " +
      " ) ";

    return this.query(sql, [
      start,
      end,
      [product],
      client,
      start,
      end,
      [product],
      client,
      start,
      end,
      [product],
      client,
      start,
      end,
      [product],
      client
    ]);
  }

  /* 
============================================================================
============================================================================
以下是国际结算量的口径产品设置
============================================================================
============================================================================
*/
  /**
   * 保存国际结算口径
   */
  async saveSettlementRangeProduct(product) {
    await this.trucateProduct();
    let sql = "insert into product (name,settleRange) value ?";
    this.query(sql, [product]).then((err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    });
  }

  //清空产品信息表
  async trucateProduct() {
    return await this.query("truncate product", []);
  }

  // 取得所有的国际结算产品
  async getAllProductFromRecord() {
    let sql =
      "select product_name as name from settle_record group by product_name";
    let params = [];

    try {
      let result = await this.query(sql, params);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //国际结算量统计口径产品
  getSettleRangeProducts() {
    let sql = "select *  from product where settleRange='1' ";
    let params = [];
    return this.query(sql, params);
  }

  getSettleRangeProductsName() {
    let sql = "select  name  from product where settleRange='1' ";
    let params = [];
    return this.query(sql, params);
  }

  async getMonthPerformance(start, end) {
    let sql =
      " select sum(busy_amount * usd_rate)/10000 as amount," +
      "count(busy_amount) as times, " +
      "left(busy_date,6) as month " +
      "from settle_record " +
      " where " +
      "product_name in ?? " +
      " and " +
      "busy_date>=? and busy_date<=? " +
      " group by month " +
      " order by month asc ";
    let params = [start, end];
    return await this.query(sql, params);
  }

  /* 
============================================================================
============================================================================
以下是结售汇量的口径产品设置
============================================================================
============================================================================
*/
  async getExchangeRangeProductsName() {
    let sql = "select name from settle_record where settleRange='2'";
    return this.query(sql, "");
  }
}

module.exports = SettlementSerive;
