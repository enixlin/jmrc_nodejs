<template>
  <div>
    选择要配置角色的用户：
    <el-select
      v-model="user"
      placeholder=""
      aria-label="用户名称"
      @change="getUserRolers"
    >
      <el-option
        v-for="item in users"
        :key="item.name"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <div class="div_roler">
      <el-checkbox-group v-model="checklist" class="ckeckbox">
        <el-checkbox
          v-for="item in rolers"
          :label="item.name"
          :key="item"
        ></el-checkbox>
      </el-checkbox-group>
    </div>

    <el-button type="primary" @click="save" style="float:left;margin-left:350px">保存</el-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectUsser: {},
      user: {},
      users: [],
      rolers: [],
      userrolers: [],
      checklist: [],
    };
  },

  async created() {
    await axios.get("/users/getAllUsers").then((result) => {
      this.users = result.data;
      console.log(this.data);
    });

    await axios.get("/rolers/getAllRolers").then((result) => {
      this.rolers = result.data;
      for (let index = 0; index < this.rolers.length; index++) {
        const r = this.rolers[index];
        r.checked = false;
      }
      console.log(this.data);
    });
  },

  methods: {
    async save() {
      //取得所有
   console.log(this.rolers);
   console.log(this.checklist);
   let rl=[];
   for (let index = 0; index < this.rolers.length; index++) {
     const e = this.rolers[index];
     for (let j = 0; j < this.checklist.length; j++) {
       const elist = this.checklist[j];
       if(e.name==elist ){
         rl.push(e.id);
       }
     }
     
   }

   await axios.post("/users/setUserRolers", { id:this.user,rolerlist:rl }).then((result)=>{
         if (result.data.affectedRows != 0) {
            this.$message({
              message: "修改用户角色成功:",
              type: "success"
            });
            this.dialogFormVisible = false;
          } else {
            this.$message({
              message: "修改失败:",
              type: "error"
            });
          }
   });

    },
    async getUserRolers() {
      this.users.forEach((element) => {
        if (element.id == this.user) {
          this.selectUser = element;
        }
      });
      this.checklist = [];
      await axios
        .post("/users/getUserRolers", { id: this.user })
        .then((result) => {
          this.userrolers = result.data;
          //刷新用户的已有角色
          for (let index = 0; index < this.rolers.length; index++) {
            this.rolers[index].checked = false;
       
            console.log(this.rolers[index]);
            for (let j = 0; j < this.userrolers.length; j++) {
              console.log(this.userrolers[j]);
              if (this.rolers[index].id == this.userrolers[j].roler_id) {
                this.checklist.push(this.rolers[index].name);
              }
            }
          }
        });
    },
  },
};
</script>

<style scoped>
.div_roler {
  width: 400px;
  margin: 20px;
  
}

.div_roler * {
  margin:10px;
  display:block;
}
</style>
