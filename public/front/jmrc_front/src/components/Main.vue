<template>
  <div class="div">
    <!-- 测试布局 -->

    <el-container>
      <transition name="el-fade-in-linear">
        <el-aside ref="menu" width="200px" v-show="toogleMenu">
          <p class="pp">系统功能</p>
          <menutree :data="menus"></menutree>
        </el-aside>
      </transition>
      <el-container>
        <el-header>
          <el-button class="logoutbtn" type="danger" @click="logout">退出</el-button>
          <el-button class="logoutbtn" type="danger" @click="tm">修改密码</el-button>
          <el-tag type="warning" class="tag">欢迎你：{{this.$store.state.authUser.name}}</el-tag>
          <el-avatar
            class="avator"
            :size="size"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>

          <el-switch
            style="display: block,float:left"
            @change="tm"
            v-model="toogleMenu"
            class="tooglebtn"
            active-color="#00ff00"
            active-text="展开菜单"
            inactive-text="收起菜单"
          ></el-switch>
        </el-header>

        <el-main>
          <el-tabs
            class="tabs"
            v-model="editableTabsValue"
            type="card"
            @tab-remove="removeTab"
            closable
          >
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import Utils from "./../Utils/Utils.js";

import menutree from "./Main/MenuTree.vue";
import eventBus from "./../Utils/EventBus.js";
import useradmin from "./User/Admin.vue";
import configRangeProduct from "./Settlement/ConfigRangeProduct.vue";
import settlement from "./Settlement/Settlement.vue";

//
export default {
  data() {
    return {
      menus: [],
      menu: [],
      totalMenu: [],
      toogleMenu: true,
      editableTabsValue: "",
      editableTabs: [],
      may: []
    };
  },
  components: {
    menutree: menutree,
    useradmin: useradmin,
    configRangeProduct: configRangeProduct,
    settlement: settlement
  },

  created() {},

  mounted() {
    let me = this;
    var util = new Utils();
    axios.get("https://linzhenhuan.net/feature/getAllFeatures").then(result => {
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
    testfunction() {},
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

    tm() {
      this.$refs.menu.width = "0px";
      console.log(this);
      console.log(this.toogleMenu == false);
      if (this.toogleMenu == false) {
        console.log("chenggong");
        this.$refs.menu.width = "0px";
      } else {
        console.log("sibai");
        this.$refs.menu.width = "200px";
      }
      //  this.toogleMenu=="open"?this.toogleMenu=="hide":this.toogleMenu=="hide";

      // this.toogleMenu==false?this.$refs.menu.width="0px":this.$refs.menu.width="200px";
      // this.toogleMenu==false?this.toogleMenu=true:this.toogleMenu=false;
      //     if(v==false){

      // console.log(this);

      //     }else{
      //       me.$refs.menu.width='200px';
      //     }
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
  /* border: 1px solid red; */
  width: 100%;
  height: 700px;
}
.menu {
  width: 200px;
  height: 600px;
  float: left;
  /* background: #cbcbcb; */
  overflow: auto;
  border: 1px solid blue;
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

/* 测试布的样式 */

.logoutbtn {
  float: right;
  margin: 10px;
}
.tooglebtn {
  float: left;
  margin: 20px 5px;
}

.el-header,
.el-footer {
  background-color: #409eff;
  color: #333;
  text-align: right;
  line-height: 30px;
}

.el-aside {
  background-color: #409eff;
  color: #fff;
  /* text-align: center; */
  line-height: 200px;
  border: 1px solid #409eff;
  margin: 0px;
  height: 700px;
}

.el-main {
  background-color: #ffffff;
  color: #e6a23c;
  border: 1px solid #409eff;
  height: 600px;
  padding: 3px;
}

body > .el-container {
  margin-bottom: 10px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.pp {
  text-align: center;
  line-height: 60px;
  font-size: x-large;
}

.avator {
  float: right;
  margin: 10px;
}

.tag {
  float: right;
  margin: 15px;
}
</style>