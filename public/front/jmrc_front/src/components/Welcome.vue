<template>
  <router-view></router-view>
</template>



<script>
export default {
  mounted() {
    this.$router.push("/login");
  }
};
</script>


<style scoped>
</style>