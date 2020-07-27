<template>
  <!-- 各产品的统计表格 -->
  <div id="unitTable" class="unitDiv">
    <!-- 导出表格按钮 -->
    <el-button type="primary" @click="exportTable">导出表格</el-button>

    <el-table
      :data="this.unitSettlement"
      :row-style="{ height: '23px' }"
      :cell-style="{ padding: 0 }"
      :stripe="true"
      height="450px"
      show-summary="true"
      :summary-method="getSummaries"
      :highlight-current-row="true"
      ref="table"
      style="width: 100%;  font-size: 8px ;text-align:center;"
      border
    >
      <el-table-column
        prop="belong_branch_code"
        label="行号"
        width="90"
        sortable
        header-align="center"
      >
        <template slot-scope="scope">
          <font size="1">{{ scope.row.belong_branch_code }}</font>
        </template>
      </el-table-column>
      <el-table-column
        prop="belong_branch_name"
        label="行名"
        width="100"
        sortable
        header-align="center"
      >
        <template slot-scope="scope">
          <font
            size="1"
          >{{ (scope.row.belong_branch_name).replace("本部（一级支行）","").replace("（一级支行）","") }}</font>
        </template>
      </el-table-column>
      <el-table-column prop="task" label="任务" width="100" sortable header-align="center">
        <template slot-scope="scope">
          <font size="1">{{ (scope.row.task) }}</font>
        </template>
      </el-table-column>

      <el-table-column
        prop="task_complete"
        label="全年任务完成率"
        width="150"
        sortable
        header-align="center"
      >
        <template slot-scope="scope">
          <p align="right">
            <font size="1">{{ number_format(scope.row.task_complete,2) }}%</font>
          </p>
        </template>
      </el-table-column>

      <el-table-column
        prop="task_complete_season"
        label="季度任务完成率"
        width="150"
        sortable
        header-align="center"
      >
        <template slot-scope="scope">
          <p align="right">
            <font size="1">{{ number_format(scope.row.task_complete_season,2) }}%</font>
          </p>
        </template>
      </el-table-column>

      <el-table-column label="笔数" width="90" prop="times_c" sortable header-align="center">
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
      <el-table-column prop="times_compare" label="同比笔数" width="100" sortable header-align="center">
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
        width="100"
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
</template>

<script>
import axios from "axios";
// import echarts from "echarts";
export default {
  data() {
    return {
      unitSettlement: [],
      task_percent: [],
      season: ""
    };
  },

  methods: {
    async getAllUnitSettle(start, end) {
      let result = await axios.post("/settlement/getTotalUnitSettle", {
        start: start,
        end: end
      });
      this.unitSettlement = result.data;
    },
    async query(start, end) {
      let me = this;
      this.unitSettlement = [];
      console.log("unit");
      let result = await axios.post("/settlement/getTotalUnitSettle", {
        start: start,
        end: end
      });
      let result1 = await axios.post("/settlement/getUnitsSettleTask", {
        start: start,
        end: end
      });
      let percent = await axios.post("/settlement/getTaskPercent", {
        start: start,
        end: end
      });
      this.task_percent = percent.data;
      let task = result1.data;
      let array = result.data;
      let unitsSettlementPrefromance = new Map();
      array.forEach(element => {
        unitsSettlementPrefromance.set(element.belong_branch_code, element);
      });
      console.log(unitsSettlementPrefromance);

      this.season = this.getSeason(end);
      //添加全年任务数，任务完成率（全年），任务完成率（季度）
      task.forEach(e => {
        unitsSettlementPrefromance.get(e.branch_code).task = e.task_amount;
        unitsSettlementPrefromance.get(e.branch_code).task_complete =
          (unitsSettlementPrefromance.get(e.branch_code).amount_c /
            10000 /
            e.task_amount) *
          100;
        unitsSettlementPrefromance.get(e.branch_code).task_complete_season =
          (unitsSettlementPrefromance.get(e.branch_code).amount_c /
            (10000 * e.task_amount * me.task_percent[me.season - 1].percent)) *
          10000;
      });
      unitsSettlementPrefromance.forEach(v => {
        me.unitSettlement.push(v);
      });
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 3 || index === 4) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index === 6 || index === 8) {
            sums[index] = this.number_format(sums[index] / 10000, 2);
          }
          if (index === 2 || index === 5 || index === 7) {
            sums[index] = this.number_format(sums[index], 0);
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },

    getSeason(date) {
      let month = date.substring(4, 6);
      if (month >= 1 && month <= 3) {
        return 1;
      }
      if (month >= 4 && month <= 6) {
        return 2;
      }
      if (month >= 7 && month <= 9) {
        return 3;
      }
      if (month >= 10 && month <= 12) {
        return 4;
      }
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

<style>
.unitDiv {
  text-align: right;
  height: 480px;
  background: #ffffff;
}
p {
  margin: 0px;
}

.el-table {
  overflow: visible !important;
}
</style> 