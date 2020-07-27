<template>
  <div>
    <div id="header" class="header">江门农商银行国际业务部信息办公系统</div>
    <div id="bg">
      <el-carousel class="bg" height="500px">
        <el-carousel-item v-for="index in images" :key="index">
          <el-image
            :src="index.src"
            style="width: 1004px; height: 400px margin:auto"
            :fit="scale-down"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div id="footer" class="footer">
      <el-button type="primary" size="mini" icon="el-icon-s-home" class="btn" @click="submit">登录</el-button>
      <el-input
        v-model="user.password"
        placeholder="密码"
        show-password="true"
        class="input"
        prefix-icon="el-icon-key"
        index="1"
      ></el-input>
      <el-input
        index="0"
        v-model="user.name"
        placeholder="用户名"
        class="input"
        prefix-icon="el-icon-user"
      ></el-input>
      <p class="p">CREATIVE BY LINZHENHUAN @ 2020</p>
    </div>
  </div>
</template>


<script>
let sha256 = require("js-sha256").sha256;
import axios from "axios";
export default {
  data() {
    return {
      user: { name: "", password: "" },
      images: []
    };
  },
  created() {},
  mounted() {
    //取得轮播图片的文件列表
    // axios.get("/file").then(result => {
    //   this.images = result.data;
    // });
    axios.post("https://linzhenhuan.net/login/checkAuth").then(result => {
      if (result.data.name != undefined) {
        this.$store.state.authUser.name = result.data.name;
        this.$store.state.authUser.id = result.data.id;
        this.$store.state.authUser.status = result.data.status;
        this.$router.push("/main");
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    submit() {
      this.user.password = sha256.hex(this.user.password);
      console.log(this.user.password);

      axios
        .post("https://linzhenhuan.net/login/authUser", this.user)
        .then(result => {
          console.log("/login/authUser result");
          console.log(result.data);
          let authUser = result.data;
          if (authUser.name != undefined) {
            this.$store.commit("login", authUser);
            this.$router.push("main");
          } else {
            this.$alert("用户名或密码错误,请重新输入", {
              confirmButtonText: "确定"
              // callback: action => {
              //   this.$message({
              //     // type: "info",
              //     // message: `action: ${action}`
              //   });
              // }
            });
          }
        });
    }
  }
};
</script>



<style scoped>
.p {
  line-height: 50px;
  color: #9e9e9e;
  text-align: center;
}
.header {
  width: 1004px;
  height: 50px;
  margin: 20px auto 0px;
  border: 2px solid #9e9e9e;
  line-height: 50px;
  font-size: 35px;
  color: #418ffc;
  text-align: center;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.bg {
  width: 1004px;
  /* height: 400px; */
  margin: 0px auto;
  border: 2px solid #9e9e9e;
}

.footer {
  width: 1004px;
  height: 70px;
  margin: 0px auto;
  border: 2px solid #9e9e9e;
  background: #f0eeee;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.input {
  width: 15%;
  height: 40px;
  margin: 15px 15px;
  float: right;
  /* border: 1px solid rgb(36, 125, 226); */
  border-radius: 5px;
}
.btn {
  width: 8%;
  height: 40px;
  margin: 15px 50px 5px 20px;
  float: right;
}

/* 轮播组件的样式 */
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #418ffc;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #e76915;
}
</style>