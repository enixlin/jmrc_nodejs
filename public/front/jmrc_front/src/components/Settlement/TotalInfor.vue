<template>
  <!-- 展示整体国际结算量情况 -->
  <div class="totalinfo">
    {{ this.params }}<br />
    {{ this.totalInfor.lastRecordDate }}<br />
    {{ this.totalInfor.totalAmount }}<br />
    {{ this.totalInfor.totalAmountTask }}<br />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      start: "",
      end: "",
      totalInfor: {},
    };
  },
  props: ["params"],

  mounted: function() {
    console.log(this);
    this.start = this.params.start;
    this.end = this.params.end;
    console.log("mounted call function ...");
    this.getTatolInfo();
  },

  methods: {
    //取得全行国际结算量
    getTatolInfo() {
      let me = this;
      console.log("getTatolInfo() run ...");
      console.log(me);
      //取得最新的业务日期
      axios.get("/settlement/getSettleRecordDate").then((result) => {
        console.log(me);
        me.totalInfor.lastRecordDate = result.data[0].busy_date;
      });
      //全行国际结算量
      axios
        .post("/settlement/getTotalSettle", { start: me.start, end: me.end })
        .then((result) => {
          me.totalInfor.totalAmount = result.data[0].amount_c;
        });
      //全行国际结算量任务
      axios
        .post("/settlement/getTotalSettleTask", {
          start: me.start,
          end: me.end,
        })
        .then((result) => {
          me.totalInfor.totalAmountTask = result.data[0].task;
        });
    },
  },
};
</script>

<style scoped>
.totalinfo {
  width: 400px;
  height: 300px;
  background: #d7e4f1;
}
</style>
