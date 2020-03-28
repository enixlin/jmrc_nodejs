<template>
  <div id="total">
    <!-- 左则展示区 任务完成率进度条 + 分月图 -->
    <div id="chart" class="chart">
      <!-- 整 体数据展示区（总量，同比，不包括任务完成率进度条） -->
      <div id="settleInfo" class="settleInfo">
        <div id="recordDate" class="infobox">
          数据日期：
          <div style="text-align:center;">
            <br />
            <font color="purple" size="5">
              {{ this.recordDate_year }}年{{ this.recordDate_month }}月{{
              this.recordDate_day
              }}日
            </font>
          </div>
        </div>

        <div id="total" class="infobox_orange">
          国际结算总量
          <div style="text-align:center;">
            <br />
            <font color="blue" size="5">{{ number_format(this.totalSettle_c / 10000, 0) }}万美元</font>
          </div>
        </div>
        <br />
        <div id="complete" class="infobox_blue">
          同比变化：
          <template v-if="this.totalSettle_c - this.totalSettle_p > 0">
            <div style="text-align:center;">
              <br />
              <font color="white" size="5">
                +{{
                number_format(
                (this.totalSettle_c - this.totalSettle_p) / 10000,
                0
                )
                }}万美元
              </font>
            </div>
          </template>
          <template v-else>
            <div style="text-align:center;">
              <br />
              <font color="yellow" size="5">
                {{
                number_format(
                (this.totalSettle_c - this.totalSettle_p) / 10000,
                0
                )
                }}万美元
              </font>
            </div>
          </template>
        </div>

        <div id="complete" class="infobox_purple">
          同比幅度：
          <template v-if="this.totalSettle_c - this.totalSettle_p > 0">
            <div style="text-align:center;">
              <br />
              <font color="white" size="5">
                +{{
                number_format(
                ((this.totalSettle_c - this.totalSettle_p) /
                this.totalSettle_p) *
                100,
                2
                )
                }}%
              </font>
            </div>
          </template>
          <template v-else>
            <div style="text-align:center">
              <br />
              <font color="yellow" size="5">
                {{
                number_format(
                ((this.totalSettle_c - this.totalSettle_p) /
                this.totalSettle_p) *
                100,
                2
                )
                }}%
              </font>
            </div>
          </template>
        </div>
      </div>
      <div id="progress" class="progress_circle">
        <el-progress
          type="circle"
          style="margin-top:25px"
          :percentage="
              number_format(
                (this.totalSettle_c / 10000 / this.totalTask) * 100,
                2
              )
            "
        ></el-progress>
        <div style="width:120px;float:left;text-align:center;margin:5px 0px">
          <font color="black" size="5">完成率</font>
          <br />
          <br />
        </div>
      </div>
      <!--国际结算量分月柱状图 -->
      <div id="monthbarchart" class="monthbarchart"></div>
    </div>

    <!-- 各产品的统计表格 -->
    <div id="productTable" class="productTable">
      <!-- 导出表格按钮 -->
      <el-button type="primary" @click="exportTable">导出表格</el-button>
      <el-table
        :data="this.productsSettle"
        :row-style="{ height: '30px' }"
        :cell-style="{ padding: 0 }"
        :stripe="true"
        height="480px"
        :highlight-current-row="true"
        style="width: 510px;  overflow: auto;font-size: 8px ;text-align:center;"
        border
      >
        <el-table-column prop="name" label="产品名称" width="100" sortable header-align="center">
          <template slot-scope="scope">
            <font size="1">{{ scope.row.name }}</font>
          </template>
        </el-table-column>
        <el-table-column label="笔数" width="60" prop="times_c" sortable header-align="center">
          <template style="align:right" slot-scope="scope">
            <p align="right" margin="0px">
              <font size="1">{{ number_format(scope.row.times_c, 0) }}</font>
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="amount_c" label="金额" width="90" sortable header-align="center">
          <template style="align:right" slot-scope="scope">
            <p align="right" margin="0px">
              <font size="1">{{ number_format(scope.row.amount_c / 10000, 2) }}</font>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="times_compare"
          label="同比笔数"
          width="60"
          sortable
          header-align="center"
        >
          <template style="text-align:right" slot-scope="scope">
            <p align="right" margin="0px">
              <font
                v-if="scope.row.times_c - scope.row.times_p > 0"
                color="green"
                size="1"
              >{{ number_format(scope.row.times_c - scope.row.times_p, 0) }}</font>
            </p>
            <p align="right" margin="0px">
              <font
                v-if="scope.row.times_c - scope.row.times_p < 0"
                color="red"
                size="1"
              >{{ number_format(scope.row.times_c - scope.row.times_p, 0) }}</font>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_compare"
          label="同比金额"
          width="90"
          sortable
          header-align="center"
        >
          <template style="text-align:right" slot-scope="scope">
            <p align="right" margin="0px">
              <font v-if="scope.row.amount_c - scope.row.amount_p > 0" color="green" size="1">
                {{
                number_format(
                (scope.row.amount_c - scope.row.amount_p) / 10000,
                2
                )
                }}
              </font>
            </p>
            <p align="right" margin="0px">
              <font v-if="scope.row.amount_c - scope.row.amount_p < 0" color="red" size="1">
                {{
                number_format(
                (scope.row.amount_c - scope.row.amount_p) / 10000,
                2
                )
                }}
              </font>
            </p>
          </template>
        </el-table-column>
        <el-table-column header-align="center" width="100" align="center" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-s-custom" @click="total_product_client(scope.$index, scope.row)"></i>-
            <i class="el-icon-menu" @click="total_product_unit(scope.$index, scope.row)"></i>-
            <i class="el-icon-data-analysis" @click="total_product_month(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!--全行业务 模板完结  -->
</template>

<script>
import axios from "axios";
import echarts from "echarts";
export default {
  data() {
    return {
      recordDate: "",
      recordDate_day: "",
      recordDate_year: "",
      recordDate_month: "",
      totalTask: "",
      totalMonth: "",
      totalSettle_c: "",
      productsSettle: "",
      totalSettle_p: ""
    };
  },

  methods: {
    exportTable() {
      alert("exporttabel");
    },
    /**
     * 当选择层次为全时，按查询按钮执行的操作
     */
    async query(start, end) {
      //取得数据日期
      let recordDate = await axios.get("/settlement/getSettleRecordDate");
      console.log(this.recordDate);
      // 取得国际结算总量
      let totalSettle = await axios.post("/settlement/getTotalSettle", {
        start: start,
        end: end
      });
      console.log(this.totalSettle);
      // 取得国际结算量任务
      let totalTask = await axios.post("/settlement/getTotalSettleTask", {
        end: end
      });
      // 取得各个国际结算产品的业务量
      let productsSettle = await axios.post(
        "/settlement/getTotalRangeProductSettlement",
        {
          end: end,
          start: start
        }
      );
      // 将数据转化一下，添加同比数据
      let array = productsSettle.data;
      let array_new = [];
      array.forEach(e => {
        array_new.push({
          name: e.name,
          amount_c: e.amount_c,
          times_c: e.times_c,
          amount_p: e.amount_p,
          times_p: e.times_p,
          amount_compare: e.amount_c - e.amount_p,
          times_compare: e.times_c - e.times_p
        });
      });
      this.productsSettle = array_new;

      // 取得国际结算量的分月数据
      let totalMonth = await axios.post("/settlement/getTotalMonthSettle", {
        end: end,
        start: start
      });
      console.log(totalMonth.data);
      let data = totalMonth.data;
      let monthlist = [];
      let amount_c_list = [];
      let amount_p_list = [];
      let times_c_list = [];
      let times_p_list = [];
      data.forEach(e => {
        monthlist.push(e.month);
        amount_c_list.push((e.amount_c / 10000).toFixed(2));
        amount_p_list.push((e.amount_p / 10000).toFixed(2));
        times_c_list.push(e.times_c);
        times_p_list.push(e.times_p);
      });

      //绘制国际结算量的分月图
      let myChart = echarts.init(document.getElementById("monthbarchart"));
      myChart.setOption({
        title: {
          text:
            "国际结算量的分月图" + ":（" + start + "-" + end + ",单位：万美元）"
        },
        grid: {
          left: 100,
          right: 80
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          right: 200,
          bottom: 10,
          data: ["当年", "去年同期"],
          selected: ["当年", "去年同期"]
        },
        tooltip: {},
        axisPointer: {
          show: true,
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777"
          }
        },

        xAxis: {
          data: monthlist
        },
        yAxis: {},
        series: [
          {
            name: "当年",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#4daff0"
              }
            },
            data: amount_c_list,
            barGap: "2%"
          },
          {
            name: "去年同期",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#888888"
              }
            },
            data: amount_p_list,
            barGap: "2%"
          }
        ]
      });

      this.totalMonth = totalMonth.data;
      this.recordDate = recordDate.data[0].busy_date;
      this.totalSettle_c = totalSettle.data[0].amount_c;
      this.totalSettle_p = totalSettle.data[0].amount_p;
      this.totalTask = totalTask.data[0].task;
      this.recordDate_year = this.recordDate.substring(0, 4);
      this.recordDate_month = this.recordDate.substring(4, 6);
      this.recordDate_day = this.recordDate.substring(6, 8);
    },
    //查询办理该项产品的所有客户
    total_product_client(index, row) {
      console.log(row);
    },

    /**
     * 格式化数字
     */
    number_format(number, decimals, dec_point, thousands_sep) {
      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
        sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
        dec = typeof dec_point === "undefined" ? "." : dec_point,
        s = "",
        toFixedFix = function(n, prec) {
          var k = Math.pow(10, prec);
          return "" + Math.ceil(n * k) / k;
        };

      s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
      var re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }

      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return s.join(dec);
    }
  }
};
</script>

<style  scoped>
.settleInfo {
  width: 430px;
  margin: 5px 5px;
  height: 235px;
  float: left;
  text-align: center;
  background: rgb(231, 234, 236);
}
.infobox {
  width: 190px;
  padding: 5px;
  height: 80px;
  margin: 10px;
  background: #7be977;
  color: white;
  float: left;
  box-shadow: 10px 10px 5px #888888;
}
.infobox_orange {
  width: 180px;
  padding: 5px;
  height: 80px;
  margin: 10px;
  background: rgb(245, 122, 40);
  color: white;
  float: left;
  box-shadow: 10px 10px 5px #888888;
}
.infobox_purple {
  width: 180px;
  padding: 5px;
  height: 80px;
  margin: 10px;
  background: rgb(210, 64, 247);
  color: white;
  float: left;
  box-shadow: 10px 10px 5px #888888;
}
.infobox_blue {
  width: 180px;
  padding: 5px;
  height: 80px;
  margin: 10px;
  background: rgb(77, 175, 240);
  color: white;
  float: left;
  box-shadow: 10px 10px 5px #888888;
}
.progress_circle {
  width: 120px;
  background: rgb(6, 224, 24);
  height: 195px;
  float: left;
  margin: 5px 0px;
  padding: 20px;
  text-align: center;
}
.productTable {
  width: 507px;
  background: rgb(231, 234, 236);
  height: 482px;
  float: left;
  font-size: xx-small;
  margin: 5px 5px;
  text-align: center;
}
.monthbarchart {
  width: 595px;
  height: 230px;
  margin: 5px 5px;
  background: rgb(231, 234, 236);
  float: left;
}
.chart {
  width: 600px;
  height: 430px;
  margin: 5px;
  float: left;
}

.tablebox th td {
  padding: 0 !important;
  height: 0px;

  line-height: 25px;
}

.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 0px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 0px;
}

p {
  margin: 0px;
}
.current-row > td {
  background: rgba(252, 33, 241, 0.219) !important;
}
</style>