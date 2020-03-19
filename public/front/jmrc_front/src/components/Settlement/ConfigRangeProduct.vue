<template>
  <!--主容器  -->
  <div>
    <!-- 产品列表  -->
    <div id="productlist" class="productlist">
      <el-checkbox-group v-model="checklist" class="ckeckbox">
        <el-checkbox v-for="item in products" :label="item.name" :key="item" class="checkbox"></el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 工具条 -->
    <div id="toolbar" class="toolbar">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>



<script>
import axios from "axios";
export default {
  methods: {
    save: async function() {
      this.productsUpdate = [];
      for (var n = 0, len = this.products.length; n < len; n++) {
        var flag = "0";
        for (var m = 0, len1 = this.checklist.length; m < len1; m++) {
          if (this.products[n].name == this.checklist[m]) {
            flag = "1";
          }
        }
        this.productsUpdate.push([this.products[n].name, flag]);
      }
      //清空原有
      axios
        .post("/settlement/saveSettlementRangeProduct", {
          products: this.productsUpdate
        })
        .then(result => {
          this.rangeproduct = result.data;
          this.$message({
            message: "修改结算量口径成功:",
            type: "success"
          });
        });
    }
  },
  async created() {
    let me = this;
    await axios.get("/settlement/getAllProductFromRecord").then(result => {
      me.products = result.data;
    });
    await axios.get("/settlement/getSettleRangeProducts").then(result => {
      me.rangeproduct = result.data;
    });

    await this.rangeproduct.forEach(element => {
      if (element.settleRange == "1") {
        this.checklist.push(element.name);
      }
    });
    console.table(this.checklist);
  },
  data() {
    return {
      productsUpdate: [],
      rangeproduct: [],
      products: [],
      checklist: []
    };
  }
};
</script>




<style scoped>
.checkbox {
  margin: 20px 30px;
}

.productlist {
  width: 50%;
  margin: 50px auto;
}
.toolbar {
  text-align: center;
}
</style>