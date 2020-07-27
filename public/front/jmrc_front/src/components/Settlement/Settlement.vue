<template>
  <div id="settlement" class="main">
    <!-- 查询工具条 -->
    <div class="toolbar" id="querytoolbar">
      <el-select v-model="level" placeholder="请选择查询层次" class="input" @change="changeLevel">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>起止日期：
      <el-input v-model="start" placeholder="开始日期" class="input"></el-input>
      <el-input v-model="end" placeholder="结束日期" class="input"></el-input>
      <el-button type="primary" class="btn" @click="query">查询</el-button>
      <el-button type="primary" class="btn" @click="query">new window</el-button>
      <el-tag type="warning">日期格式(年月日)：20190731</el-tag>
    </div>

    <total v-show="this.level == '全行'" ref="total"></total>
    <unit v-show="this.level == '经营单位'" ref="unit"></unit>
    <client v-show="this.level == '客户'" ref="client"></client>
  </div>
</template>
<script>
import total from "./Settlement_total";
import unit from "./Settlement_unit";
import client from "./Settlement_client";
export default {
  async created() {
    //取得本年1月1日
    this.start = new Date().getFullYear() + "0101";
    let now = new Date();
    let month =
      now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
    let day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
    this.end = "" + now.getFullYear() + month + day;
    this.query();
  },
  components: {
    total: total,
    unit: unit,
    client: client
    // window: window,
  },
  async mounted() {},

  data() {
    return {
      start: "",
      end: "",
      level: "",
      selectedValue: "",
      options: [
        { value: "全行", label: "全行" },
        { value: "经营单位", label: "经营单位" },
        { value: "客户", label: "客户" }
      ]
    };
  },
  methods: {
    changeLevel(value) {
      this.level = value;
      if (this.level == "全行") {
        this.$refs.total.query(this.start, this.end);
      }
      if (this.level == "经营单位") {
        this.$refs.unit.query(this.start, this.end);
      }
      if (this.level == "客户") {
        this.$refs.client.query(this.start, this.end);
      }
    },

    async query() {
      if (this.level == "全行") {
        this.$refs.total.query(this.start, this.end);
      }
      if (this.level == "经营单位") {
        this.$refs.unit.query(this.start, this.end);
      }
      if (this.level == "客户") {
        this.$refs.client.query(this.start, this.end);
      }
    }
  }
};
</script>

<style scoped>
.main {
  /* overflow: auto; */
  margin: 2px;
}

.toolbar {
  width: 100%;
  background: #ece8e7;
}
.input {
  width: 150px;
  margin: 5px 20px;
}
.btn {
  width: 100px;
  margin: 5px 20px;
}
</style>
