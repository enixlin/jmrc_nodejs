<template>
  <div>
    选择要配置功能的角色：
    <el-select
      v-model="roler"
      placeholder=""
      aria-label="角色名称"
      @change="getRolerFeatures"
    >
      <el-option
        v-for="item in rolers"
        :key="item.name"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <div class="div_feature">
      <el-checkbox label="全选" @change="selectAll"></el-checkbox>
      <el-checkbox-group v-model="checklist" class="ckeckbox">
        <el-checkbox
          v-for="item in features"
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
      selectAllFeature:false,
      selectRoler: {},
      roler: {},
      rolers: [],
      features: [],
      rolerfeatures: [],
      checklist: [],
    };
  },

  async created() {
    await axios.get("/rolers/getAllRolers").then((result) => {
      this.rolers = result.data;
      console.log(this.data);
    });

    await axios.get("/features/getAllFeatures").then((result) => {
      this.features = result.data;
      for (let index = 0; index < this.features.length; index++) {
        const r = this.features[index];
        r.checked = false;
      }
      console.log(this.data);
    });
  },

  methods: {
    selectAll(){
      this.selectAllFeature=!this.selectAllFeature;
      if(this.selectAllFeature==false){
        this.checklist=[];
      }else{
        this.features.forEach((e)=>{
          this.checklist.push(e.name);
        });
      }
    },



    async save() {
      //取得所有
   let fl=[];
   for (let index = 0; index < this.features.length; index++) {
     const e = this.features[index];
     for (let j = 0; j < this.checklist.length; j++) {
       const elist = this.checklist[j];
       if(e.name==elist ){
         fl.push(e.id);
       }
     }
     
   }

   await axios.post("/rolers/setRolerFeatures", { id:this.roler,featurelist:fl }).then((result)=>{
         if (result.data.affectedRows != 0) {
            this.$message({
              message: "修改角色功能成功:",
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
    async getRolerFeatures() {
      this.rolers.forEach((element) => {
        if (element.id == this.roler) {
          this.selectRoler = element;
        }
      });
      this.checklist = [];
      await axios
        .post("/rolers/getRolerFeatures", { id: this.roler })
        .then((result) => {
          this.rolerfeatures = result.data;
          //刷新角色的已有功能
          for (let index = 0; index < this.features.length; index++) {
            this.features[index].checked = false;
           
            for (let j = 0; j < this.rolerfeatures.length; j++) {
    
              if (this.features[index].id == this.rolerfeatures[j].feature_id) {
                this.checklist.push(this.features[index].name);
              }
            }
          }
          console.log("this.checklist");
          console.log(this.checklist);
        });
    },
  },
};
</script>

<style scoped>
.div_feature {
  width: 400px;
  height:500px;
  overflow:auto;
  margin: 20px;
  
}

.div_feature * {
  margin:10px;
  display:block;
}
</style>
