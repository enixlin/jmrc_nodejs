<template>
  <div id="total">
    {{ params.start }}--{{ params.end }}
    <!-- 展示整体国际结算量情况 -->
    <TotalInfo :params="params"></TotalInfo>

    <button @click="reback">click</button>
    <!-- <window></window> -->
  </div>
</template>

<!--全行业务 模板完结  -->

<script>
import axios from "axios";
import echarts from "echarts";
// import window from "./Window";
import eventBus from "./../../Utils/EventBus";

import TotalInfo from "@/components/Settlement/TotalInfor.vue";
// import Window from './Window.vue';

export default {
  data() {
    return {
      date: { start: "", end: "" },
    };
  },
  props: ["params"],
  mounted() {
    console.log("settlement_total mounted");
    let me = this;
    eventBus.$on("closeWindow", function(arg) {
      me.removeWindow(arg);
    });
  },
  components: {
    // window,
    TotalInfo,
  },
  created: {},
  methods: {
    reback() {
      this.$emit("reback", "return");
    },
    //打开客户统计窗口
    getProductClientSettlement(index, row) {
      //查询办理这项产品的客户的业务量统计
      console.log(row.name);
      let Params = {
        title: row.name + "--客户业务量统计表",
      };
      let flag = this.$refs.windowsContainer.isExist(Params);
      if (!flag) {
        let postUrl = "/settlement//getProductClientSettlement";
        let params = { product: row.name, start: this.start, end: this.end };
        axios.post(postUrl, params).then((result) => {
          let windowParams = {
            title: row.name + "--客户业务量统计表",
            data: result.data,
          };
          this.$refs.windowsContainer.add(windowParams);
        });
      }
    },

    exportTable() {
      // this.dialogshow = true;
    },
    /**
     * 当选择层次为全时，按查询按钮执行的操作
     */
    async query(start, end) {
      console.log("settlement_total query run....");
      this.$data.start = start;
      this.$data.end = end;
      //取得数据日期
      let recordDate = await axios.get("/settlement/getSettleRecordDate");
      console.log(this.recordDate);
      // 取得国际结算总量
      let totalSettle = await axios.post("/settlement/getTotalSettle", {
        start: start,
        end: end,
      });
      console.log(this.totalSettle);
      // 取得国际结算量任务
      let totalTask = await axios.post("/settlement/getTotalSettleTask", {
        end: end,
      });
      // 取得各个国际结算产品的业务量
      let productsSettle = await axios.post(
        "/settlement/getTotalRangeProductSettlement",
        {
          end: end,
          start: start,
        }
      );
      // 将数据转化一下，添加同比数据
      let array = productsSettle.data;
      let array_new = [];
      array.forEach((e) => {
        array_new.push({
          name: e.name,
          amount_c: e.amount_c,
          times_c: e.times_c,
          amount_p: e.amount_p,
          times_p: e.times_p,
          amount_compare: e.amount_c - e.amount_p,
          times_compare: e.times_c - e.times_p,
        });
      });
      this.productsSettle = array_new;

      // 取得国际结算量的分月数据
      let totalMonth = await axios.post("/settlement/getTotalMonthSettle", {
        end: end,
        start: start,
      });
      console.log(totalMonth.data);
      let data = totalMonth.data;
      let monthlist = [];
      let amount_c_list = [];
      let amount_p_list = [];
      let times_c_list = [];
      let times_p_list = [];
      data.forEach((e) => {
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
            "国际结算量的分月图" +
            ":（" +
            start +
            "-" +
            end +
            ",单位：万美元）",
        },
        grid: {
          left: 100,
          right: 80,
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          right: 200,
          bottom: 10,
          data: ["当年", "去年同期"],
          selected: ["当年", "去年同期"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        axisPointer: {
          show: true,
          link: { xAxisIndex: "all" },
          label: {
            backgroundColor: "#777",
          },
        },

        xAxis: {
          data: monthlist,
        },
        yAxis: {},
        series: [
          {
            name: "当年",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#4daff0",
              },
            },
            data: amount_c_list,
            barGap: "2%",
          },
          {
            name: "去年同期",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#888888",
              },
            },
            data: amount_p_list,
            barGap: "2%",
          },
        ],
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

    /**
     * 自定义合并行计算
     */
    getSummaries(param) {
      console.log("param", param);

      if (param.data == "") {
        return;
      }
      const { columns, data } = param;
      const sums = [];
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
      this.showsummary = true;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 0 || index === 5) {
          sums[index] = "";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 2 || index === 4) {
            sums[index] = this.number_format(sums[index] / 10000, 2);
          }
          if (index === 1 || index === 3) {
            sums[index] = this.number_format(sums[index], 0);
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
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
    },
  },
};
</script>

<style scoped>
.settleInfo {
  width: 430px;
  margin: 5px 1px;
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
  width: 502;
  background: rgb(231, 234, 236);
  height: 480px;
  float: left;
  font-size: xx-small;
  margin: 10px 1px;
  text-align: center;
}
.monthbarchart {
  width: 590px;
  height: 250px;
  margin: 2px 2px;
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

.drag-handle {
  width: 98%;
  height: 30px;
  margin: 3px;
  padding: 3px;
  background: #888888;
  z-index: 100;
}
</style>
