<template>
  <div id="client" class="client">
    <!-- <input type="button" @click="add" value="addbtn" /> -->
    <!-- <el-button type="primary">fdsfds</el-button> -->
  </div>
</template>

<script>
// import wind from "./window";\
// import my from "./Mycomponent";
export default {
  data() {
    return {
      active: true,
      dialogVisible: true,
      wins: []
    };
  },
  components: {},
  methods: {
    query(start, end) {
      console.log(start, end);
    },
    add() {
      this.wins.push({});
    }
  }
};
</script>

<style>
.client {
  width: 100%;
  height: 500px;
  overflow: auto;
}
.dr {
  width: 600px;
  height: 200px;
  background: red;
}
</style>
