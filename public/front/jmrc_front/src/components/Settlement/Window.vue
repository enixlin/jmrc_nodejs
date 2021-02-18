<template>
  <!-- 浮动窗口 -->
  <div style="width:100%;">
    <vue-draggable-resizable
      v-for="item in windowsContainer"
      :style="item.style"
      :key="item"
      class="window"
      
     
      :draggable="draggablehandle"
      :drag-handle="'.drag-handle'"
    >
      <!-- 拖动控制条 -->
      <div class="drag-handle"   @mousedown="active">{{ item.title }}  <el-button  ref="item.title" size="mini" round  @click="remove">关闭</el-button></div>

      <!-- 窗口内容容器 -->
      <div style="overflow:auto">
        <!-- <el-table :data="item.data">
          <el-table-column label=""></el-table-column>
        </el-table> -->
      </div>
    </vue-draggable-resizable>
  </div>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import eventBus from "./../../Utils/EventBus.js";

export default {

  components:[
    VueDraggableResizable,
    eventBus
  ],
  data() {
    return {
      windowsContainer: [], //浮动窗口管理容器
      activedWindow: "",
      draggablehandle:true,
      style_customer:{
        border: '1px solid black'
      }
    };
  },
  props: ["params"],
  methods: {

    active(me,en) {
      console.log("me+en");
      console.log(me);
      console.log(en);
      this.$data.windowsContainer.forEach(e=>{
          if(me.target.innerText==e.title){
              e.style.zIndex="999";
        }else{
              e.style.zIndex=e.orgIndex;
        }
      });


       
    },
    //添加窗口
    add(params) {
      let p = params;
      p.orgIndex = this.$data.windowsContainer.length + 100;
      p.style={zIndex:this.$data.windowsContainer.length + 100};
      console.log("p");
      console.log(p);

      if (!this.isExist(p)) {
        this.windowsContainer.push(p);
      } else {
        //将之前已创建的窗口的z属性设为
        this.$data.windowsContainer.forEach((e) => {
          if (e.title == params.title) {
            e.active = true;
            console.log("e.active");
            console.log(e.active);
            e.style.zIndex="999";
          } else {
            e.active = false;
            console.log("e.active");
            console.log(e.active);
            e.style.zIndex=e.orgIndex;
          }
        });
      }
      console.log("containner");
      console.log(this.windowsContainer);
    },
    // 移除窗口
    remove(ev) {
      console.log(ev);
       this.$data.windowsContainer.forEach(e=>{
          if(me.target.innerText==e.title){
              e.style.zIndex="999";
        }else{
              e.style.zIndex=e.orgIndex;
        }
      });
    },
    // 检查窗口是否已存在
    isExist(params) {
      let flag=false;
      this.$data.windowsContainer.forEach((element) => {
        console.log("element");
        console.log(element);
        if (element.title == params.title) {
          flag=true;
        }
      }); 
      return flag;
    },
  },
};
</script>

<style scoped>
.window {
  min-width: 405px;
  min-height: 200px;
  background: white;
  z-index: 199;
  border:1px solid #6db0fc;
   box-shadow: 3px  #dddcdc;
   color:white;
   float:left;
   
  
}

.drag-handle {
  width:99%;
  padding: 2px;
  min-width: 400px;
  height: 30px;
  background: #6db0fc;
}
</style>
