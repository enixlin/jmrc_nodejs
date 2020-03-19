<template>
  <div class="div">
    <div class="header">this is header</div>
    <div class="menu">
      <menutree :data="menus"></menutree>
    </div>
    <div id="tab" class="tab">
      <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" closable>
        <el-tab-pane
          :key="item.name"
          v-for="(item) in editableTabs"
          :label="item.title"
          icon="item.icon"
          :name="item.name"
        >
          <component :is="item.content"></component>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer">
      this is footer
      <el-button type="primary" @click="logout">退出</el-button>
      <!-- <el-button type="primary" @click="admin">用户管理</el-button> -->
      <el-button type="primary" @click="charts">图表测试</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Utils from "./../Utils/Utils.js";

import menutree from "./Main/MenuTree.vue";
import eventBus from "./../Utils/EventBus.js";
import useradmin from "./User/Admin.vue";
import configRangeProduct from "./Settlement/ConfigRangeProduct.vue";

//import navigationItem from "./navigationItem.vue";

export default {
  data() {
    return {
      menus: [],
      menu: [],
      totalMenu: [],
      editableTabsValue: "",
      editableTabs: []
    };
  },
  components: {
    menutree: menutree,
    useradmin: useradmin,
    configRangeProduct: configRangeProduct
  },

  created() {},

  mounted() {
    let me = this;
    var util = new Utils();
    axios.get("/feature/getAllFeatures").then(result => {
      let tree = util.arrayToTree(result.data);
      console.table(tree);
      this.menus = { d: tree[0].children, collapse: false };
      this.menu = tree[0].children;
      console.log(this.menus);
    });

    eventBus.$on("addTab", function(arg) {
      me.createTab(arg);
    });
  },
  methods: {
    createTab(item) {
      console.log(item);
      console.log(this.editableTabs);
      var exist = false;
      for (var i = 0; i < this.editableTabs.length; i++) {
        if (item.name === this.editableTabs[i].name) {
          exist = true;
          break;
        }
      }
      if (exist === true) {
        this.editableTabsValue = item.name;
        return;
      }

      this.editableTabs.push({
        title: item.name,
        name: item.name,
        icon: item.icon,
        content: item.panel
      });
      this.editableTabsValue = item.name;
    },

    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },

    handleTabsChange(tab) {
      this.$store.commit("handleTabsChange", tab.name);
    },

    logout() {
      this.$store.commit("logout");
      axios.get("/login/logout").then(() => {
        this.$router.push("/login");
      });
    },
    charts() {
      this.$router.push("/charts");
    },
    admin() {
      this.$router.push("/user");
    },
    quarterManage() {
      alert("quarterManage");
    },
    riskManage() {
      alert("riskManage");
    }
  }
};
</script>


<style scoped>
.div {
  margin: 5px auto;
  border: 1px solid red;
  width: 100%;
  height: 700px;
}
.menu {
  width: 15%;
  height: 600px;
  float: left;
  /* background: #cbcbcb; */
  overflow: auto;
  border: 1px solid blue;
}
.tab {
  width: 84%;
  height: 600px;
  float: left;
  border: 1px solid blue;
  /* background: #54ec2e; */
}
.header {
  width: 100%;
  height: 50px;
  float: left;
  border: 1px solid red;
}
.footer {
  width: 100%;
  height: 50px;
  float: right;
  border: 1px solid green;
}
</style>