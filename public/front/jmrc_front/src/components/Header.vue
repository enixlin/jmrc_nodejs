<template >
  <div class="header">
    <img src="/images/head.jpg" />
    <div class="title">{{title}}</div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      title: "国际业务部信息管理系统"
    };
  }
};
</script>


<style scoped>
.header {
  width: 100%;
  height: 104px;
  border: 2px;
  font-size: 45px;
  line-height: 104px;
  border: 2px solid #aabbcc;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: gray;
  color: white;
}
.title {
  width: 40%;
  height: 104px;
  border: 2px;
  font-size: 35px;
  line-height: 104px;
  float: right;
  border-radius: 10px;
  text-align: center;
  background: #2889eb;
  color: white;
}
</style>