<template>
  <div>
    <!-- 工具栏 -->
    <div id="tool" class="toolbar">
      <el-input
        class="input"
        v-model="user.name"
        placeholder="用户名称"
        prefix-icon="el-icon-user"
        width="100px"
      ></el-input>
      <el-input
        class="input"
        v-model="user.password"
        placeholder="用户密码"
        prefix-icon="el-icon-key"
        width="100px"
      ></el-input>
      <el-button class="btn" type="primary" icon="el-icon-plus" @click="addUser">添加</el-button>
    </div>

    <!-- 用户列表 -->
    <el-table
      :data="this.data.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;overflow: auto;font-size: 10px"
      row-style="height:20px"
      cell-style="padding:0"
      height="380px"
    >
      <el-table-column prop="id" label="编号" width="width"></el-table-column>
      <el-table-column prop="name" label="用户名" width="width"></el-table-column>
      <el-table-column prop="password" label="密码" width="width"></el-table-column>
      <el-table-column prop="status" label="状态" width="width"></el-table-column>
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
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="row" label-position="left">
        <el-form-item label="编号" label-width="100px">{{row.id}}</el-form-item>
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="row.name"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" label-width="100px">
          <el-input v-model="userInfo.password_old"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="100px">
          <el-input v-model="userInfo.password_new"></el-input>
        </el-form-item>
        <el-form-item label="新密码确认" label-width="100px">
          <el-input v-model="userInfo.password_new_confirm"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-select v-model="row.status" placeholder="请选择用户状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="save({row:row,password_old:userInfo.password_old,password_new:userInfo.password_new,password_new_confirm:userInfo.password_new_confirm,status:row.status})"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
var sha256 = require("js-sha256").sha256;
export default {
  data() {
    return {
      user: { name: "", password: "" },
      userInfo: {
        id: "",
        name: "",
        password_old: "",
        password_new: "",
        password_new_confirm: "",
        status: ""
      },
      data: [],
      search: "",
      row: { id: "", name: "", password: "", status: "" },
      dialogFormVisible: false
    };
  },

  async created() {
    await axios.get("/users/getAllUsers").then(result => {
      this.data = result.data;
    });
  },

  methods: {
    /*  */
    /*修改用户  */
    /*  */
    save(object) {
      let row = object.row;
      let password_old = object.password_old;
      let password_new = object.password_new;
      let password_new_confirm = object.password_new_confirm;
      let status = row.status;
      let newUserInfo;
      if (sha256.hex(password_old) != row.password) {
        this.$alert("旧密码不正确", {
          confirmButtonText: "确定"
        });
        return;
      }
      if (password_new == password_new_confirm) {
        newUserInfo = {
          id: row.id,
          name: row.name,
          password: sha256.hex(password_new),
          status: status
        };

        axios.post("/users/saveUser", newUserInfo).then(result => {
          //刷新用户列表
          axios.get("/users/getAllUsers").then(result => {
            this.data = result.data;
          });

          if (result.data.affectedRows != 0) {
            this.$message({
              message: "修改用户成功:",
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
      } else {
        this.$alert("两次输入的新密码不一致", {
          confirmButtonText: "确定",
          callback: () => {
            return;
          }
        });
      }
    },
    /*  */
    /* 添加用户 */
    /*  */
    addUser() {
      if (this.user.name != undefined && this.user.password != undefined) {
        if (this.user.name == "") {
          this.$alert("用户名不能为空");
          return;
        }
        if (this.user.password == "") {
          this.$alert("用户密码不能为空");
          return;
        }
        //加密用户密码
        this.user.password = sha256.hex(this.user.password);
        axios.post("/users/addUser", this.user).then(result => {
          if (result.data == "用户已存在") {
            this.$alert("失败<br>" + result.data, {
              confirmButtonText: "确定"
            });
          } else {
            this.$alert("添加用户成功<br>" + result.data, {
              confirmButtonText: "确定"
            });
          }
          //刷新用户列表
          axios.get("/users/getAllUsers").then(result => {
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
    /* 删除用户 */
    /*  */
    handleDelete(index, row) {
      this.$confirm("删除用户:" + row.name + "?").then(() => {
        axios.post("/users/deleteUser", row).then(() => {
          //刷新用户列表
          axios.get("/users/getAllUsers").then(result => {
            this.data = result.data;
          });
          this.$message({
            message: "删除用户成功:,已删除用户:" + row.name,
            type: "success"
          });
        });
      });
    }
  }
};
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