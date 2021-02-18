<template>
  <div>
    <!-- 工具栏 -->
    <div id="tool" class="toolbar">

         <el-input
        class="input"
        v-model="feature.name"
        placeholder="功能名称"
        prefix-icon="el-icon-user"
        width="60px"
      ></el-input>
         <el-input
        class="input"
        v-model="feature.url"
        placeholder="请求网址"
        prefix-icon="el-icon-user"
        width="60px"
      ></el-input>
    <el-select v-model="feature.leaf" placeholder="功能节点">
      <el-option
        v-for="item in leafvalue"
        :key="item.key"
        :label="item.label"
         width="60px"
        :value="item.value">
      </el-option>
    </el-select>

        <el-input
        class="input"
        v-model="feature.parent_id"
        placeholder="父节点"
        prefix-icon="el-icon-user"
        width="60px"
      ></el-input>

          <el-input
        class="input"
        v-model="feature.panel"
        placeholder="操作界面"
        prefix-icon="el-icon-user"
        width="60px"
      ></el-input>
        <el-input
        class="input"
        v-model="feature.icon"
        placeholder="图标"
        prefix-icon="el-icon-user"
        width="60px"
      ></el-input>

      <el-button class="btn" type="primary" icon="el-icon-plus" @click="addfeature">添加</el-button>
    </div>

    <!-- 功能列表 -->
    <el-table
      :data="this.data.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;overflow: auto;font-size: 10px"
      row-style="height:20px"
      cell-style="padding:0"
      height="380px"
    >
      <el-table-column prop="id" label="编号" width="width"></el-table-column>
      <el-table-column prop="name" label="功能名" width="width"></el-table-column>
      <el-table-column label="操作" width="width">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            @change="function(){console.log(scope)}"
          />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改用户信息对话框 -->
    <el-dialog title="功能信息" :visible.sync="dialogFormVisible">
      <el-form :model="row" label-position="left">
        <el-form-item label="编号" label-width="100px">{{row.id}}</el-form-item>
        <el-form-item label="功能名" label-width="100px">
          <el-input v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="请求网址" label-width="100px">
          <el-input v-model="row.url"></el-input>
        </el-form-item>
        <el-form-item label="是否叶节点" label-width="100px">
          <el-input v-model="row.leaf"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="100px">
          <el-input v-model="row.icon"></el-input>
        </el-form-item>
        <el-form-item label="父节点" label-width="100px">
          <el-input v-model="row.parent_id"></el-input>
        </el-form-item>
         <el-form-item label="操作界面" label-width="100px">
          <el-input v-model="row.panel"></el-input>
        </el-form-item>
       
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save({row:row})"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
// var sha256 = require("js-sha256").sha256;
export default {
  data() {
    return {
      value:{},
      leafvalue:[{value:"true",key:"1"},{value:"false",key:"2"}],
      feature: { name:"",id:"" ,url:"",icon:"",leaf:"",parent_id:"",panel:""},
      featureInfo: {
        id: "",
        name: ""
    
      },
      data: [],
      search: "",
      row: { id: "", name: "" },
      dialogFormVisible: false
    };
  },

  async created() {
    await axios.get("/features/getAllfeatures").then(result => {
      this.data = result.data;
    });
  },

  methods: {
    /*  */
    /*修改功能  */
    /*  */
    save(object) {
      let row = object.row;
      let newfeatureInfo;
   
    
        newfeatureInfo = {
          id: row.id,
          name: row.name,
          url:row.url,
          icon:row.icon,
          leaf:row.leaf,
          parent_id:row.parent_id,
          panel:row.panel
       
        };

        axios.post("/features/savefeature", newfeatureInfo).then(result => {
          //刷新功能列表
          axios.get("/features/getAllfeatures").then(result => {
            this.data = result.data;
          });

          if (result.data.affectedRows != 0) {
            this.$message({
              message: "修改功能成功:",
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
  
    /*  */
    /* 添加功能 */
    /*  */
    addfeature() {
      console.log("addfeature");

      if (this.feature.name != undefined ) {
        console.log("run");
        if (this.feature.name == "") {
          this.$alert("功能名不能为空");
          return;
        }
        axios.post("/features/addfeature", this.feature).then(result => {
          if (result.data == "功能已存在") {
            this.$alert("失败<br>" + result.data, {
              confirmButtonText: "确定"
            });
          } else {
            this.$alert("添加功能成功<br>" + result.data, {
              confirmButtonText: "确定"
            });
          }
          //刷新功能列表
          axios.get("/features/getAllfeatures").then(result => {
            this.data = result.data;
          });
        });
      }
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.row = row;
      this.userInfo.password_old = "";
      this.userInfo.password_new = "";
      this.userInfo.password_new_confirm = "";
    },

    /*  */
    /* 删除功能 */
    /*  */
    handleDelete(index, row) {
      this.$confirm("删除功能:" + row.name + "?").then(() => {
        axios.post("/features/deletefeature", row).then(() => {
          //刷新功能列表
          axios.get("/features/getAllfeatures").then(result => {
            this.data = result.data;
          });
          this.$message({
            message: "删除功能成功:,已删除:" + row.name,
            type: "success"
          });
        });
      });
    }
      }
  }
  

</script>


<style scoped>
.toolbar {
  width: 100%;
  height: 50px;
}
.input {
  width: 150px;
  margin: 5px 20px;
}
.btn {
  width: 100px;
  margin: 5px 20px;
}
.tablebox th td {
  padding: 0 !important;
  height: 30px;
  line-height: 30px;
}
</style>