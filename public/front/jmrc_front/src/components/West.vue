<template>
  <div class="west">
    <el-radio-group v-model="isCollapse" style="margin:10px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-s-marketing"></i>
          <span slot="title">报表分析</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="国际结算分析" @click="show">
            <i class="el-icon-eleme"></i>国际结算分析
          </el-menu-item>
          <el-menu-item index="1-2">结售汇分析</el-menu-item>
          <el-menu-item index="1-2">贸易融资分析</el-menu-item>
          <el-menu-item index="1-2">外币存款分析</el-menu-item>
          <el-menu-item index="1-2">外汇利润分析</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">报表分析</span>
          <el-menu-item index="国际结算分析1" @click="show">国际结算分析</el-menu-item>
          <el-menu-item index="1-2">结售汇分析</el-menu-item>
          <el-menu-item index="1-2">贸易融资分析</el-menu-item>
          <el-menu-item index="1-2">外币存款分析</el-menu-item>
          <el-menu-item index="1-2">外汇利润分析</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // eslint-disable-next-line no-console
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // eslint-disable-next-line no-console
      console.log(key, keyPath);
    },
    show(index) {
      alert("index");
      alert(index.name);
    }
    // handleNodeClick(data) {
    //   //alert(data.toString());
    // }
  }
};
</script>


<style scoped>
.west {
  height: 600px;
  width: 10%;
  margin: 10px;
  /* border: 2px solid gray; */
  /* overflow: scroll; */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
  border: 2px solid gray;
  color: antiquewhite;
  font-style: oblique;
  background: rgb(77, 125, 228);
}
</style>