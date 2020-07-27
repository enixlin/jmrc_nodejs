<template>
  <div>
    <el-menu
      class="el-menu"
      index="item.id"
      v-for="item in data.d?data.d:data"
      mode="vertical"
      :key="item"
      :collapse="false"
      @open="onMenu"
    >
      <template v-if="item.children">
        <el-submenu class="submenu">
          <template slot="title">
            <p align="left">
              <font color="orange" size="4">
                <i :class="item.icon"></i>
                {{item.name}}
              </font>
            </p>
          </template>
          <menutree :data="item.children"></menutree>
        </el-submenu>
      </template>

      <template v-else>
        <el-menu-item class="menuitem" :index="item.id" @click="onMenu(item)">
          <p align="left">
            <font color="blue" size="3">
              <i :class="item.icon"></i>
              {{item.name}}
            </font>
          </p>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>



<script>
import menutree from "./MenuTree";
import eventBus from "./../../Utils/EventBus.js";

export default {
  name: "menutree",
  data() {
    return {
      isCollapse: false,
      selected: [],
      menu_data: {}
    };
  },
  components: {
    menutree: menutree
  },
  props: ["data"],

  methods: {
    change: function(index) {
      this.selected = index;
      console.log(this.selected);
    },
    onMenu: function(item) {
      console.log(item);
      eventBus.$emit("addTab", item);
    }
  }
};
</script>



<style scoped>
.el-menu {
  width: 100%;
}
.submenu {
  width: 100%;
}
.menuitem {
  width: 100%;
  margin: 2px;
}
</style>