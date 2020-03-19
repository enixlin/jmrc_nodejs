<template>
  <div class="question">
    <p>{{text}}请问你的性别是：</p>
    <div class="textarea">
      <!-- <RadioGroup v-model="selected"> -->

      <el-input type="textarea" v-model="text" placeholder="请输入内容" :rows="15"></el-input>

      <!-- </RadioGroup> -->
    </div>

    <div class="btnArea">
      <el-button type="primary" @click="back" size="mini">上一步</el-button>
      <el-button type="primary" @click="next" size="mini">下一步</el-button>
      <el-button type="button" @click="reset" size="mini">重置</el-button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      gender: ["男", "女", "保密"],
      selected: "1",
      text: this.$store.state.user.name
    };
  },

  methods: {
    next() {
      let selectedGender = this.selected;
      alert(selectedGender);
    },
    back() {
      this.$router.push("./login");
    },
    reset() {}
  }
};
</script>


<style scoped>
.question {
  width: 300px;
  height: 500px;
  border: 2px solid #d1cfcf;
  margin: auto;
  border-radius: 10px;
}
.textarea {
  /* float: left; */
  width: 80%;
  /* padding: 10px; */
  margin: auto;
}
.selectArea * {
  margin: 20px;
}
.btnArea {
  width: 100%;
  margin: auto;
  /* border: 1px solid blue; */
  padding: 5px;
}
.btnArea button {
  margin: 10px;
  /* border: 1px solid blue; */
}
p {
  font-size: 20px;
  text-align: left;
  margin: 10px;
  padding-top: 20px;
}
</style>