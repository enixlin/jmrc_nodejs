<template >
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {

    axios.get("/login/checkAuth").then(result => {
      console.log("result name");
      console.log(result.data);
      if (result.data.name != undefined) {
        this.$store.state.authUser.name = result.data.name;
        this.$store.state.authUser.id = result.data.id;
        this.$store.state.authUser.status = result.data.status;
        this.$router.push("/main");
      } else {
        this.$router.push("/login");
      }
    });
  }
}
</script>

<style>
.app {
  width: 100%;
  height: 600px;
}
</style>
