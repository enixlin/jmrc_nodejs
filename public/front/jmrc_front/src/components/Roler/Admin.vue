<template>
  <div>
    <!-- 工具栏 -->
    <div id="tool" class="toolbar">
      <el-input
        class="input"
        v-model="roler.name"
        placeholder="角色名称"
        prefix-icon="el-icon-user"
        width="100px"
      ></el-input>
  
      <el-button class="btn" type="primary" icon="el-icon-plus" @click="addRoler">添加</el-button>
    </div>

    <!-- 角色列表 -->
    <el-table
      :data="this.data.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;overflow: auto;font-size: 10px"
      row-style="height:20px"
      cell-style="padding:0"
      height="380px"
    >
      <el-table-column prop="id" label="编号" width="width"></el-table-column>
      <el-table-column prop="name" label="角色名" width="width"></el-table-column>
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
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible">
      <el-form :model="row" label-position="left">
        <el-form-item label="编号" label-width="100px">{{row.id}}</el-form-item>
        <el-form-item label="角色名" label-width="100px">
          <el-input v-model="row.name"></el-input>
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
      roler: { name:"",id:"" },
      rolerInfo: {
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
    await axios.get("/rolers/getAllRolers").then(result => {
      this.data = result.data;
    });
  },

  methods: {
    /*  */
    /*修改角色  */
    /*  */
    save(object) {
      let row = object.row;
      let newRolerInfo;
   
    
        newRolerInfo = {
          id: row.id,
          name: row.name,
       
        };

        axios.post("/rolers/saveRoler", newRolerInfo).then(result => {
          //刷新角色列表
          axios.get("/rolers/getAllRolers").then(result => {
            this.data = result.data;
          });

          if (result.data.affectedRows != 0) {
            this.$message({
              message: "修改角色成功:",
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
    /* 添加角色 */
    /*  */
    addRoler() {
      console.log("addRoler");

      if (this.roler.name != undefined ) {
        console.log("run");
        if (this.roler.name == "") {
          this.$alert("角色名不能为空");
          return;
        }
        axios.post("/rolers/addRoler", this.roler).then(result => {
          if (result.data == "角色已存在") {
            this.$alert("失败<br>" + result.data, {
              confirmButtonText: "确定"
            });
          } else {
            this.$alert("添加角色成功<br>" + result.data, {
              confirmButtonText: "确定"
            });
          }
          //刷新角色列表
          axios.get("/rolers/getAllRolers").then(result => {
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
    /* 删除角色 */
    /*  */
    handleDelete(index, row) {
      this.$confirm("删除角色:" + row.name + "?").then(() => {
        axios.post("/rolers/deleteRoler", row).then(() => {
          //刷新角色列表
          axios.get("/rolers/getAllRolers").then(result => {
            this.data = result.data;
          });
          this.$message({
            message: "删除角色成功:,已删除:" + row.name,
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