<template>
  <!-- 容器主体 -->
  <div id="container" class="container">
    <!-- 容器头部，包括标题和操作按键（关闭） -->
    <div id="bar" class="bar" @mouseover="over" @mousedown="move" @mouseup="stopmove">
      <!-- 标题 -->
      <div id="title" class="title"></div>
      <!-- 操作按键 -->
      <div id="btns" class="btns"></div>
    </div>
    <!-- 内容容器 -->
    <div id="content" class="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      p_x: 0,
      p_y: 0
    };
  },
  methods: {
    move(ev) {
      this.$el.addEventListener("mousermove", function() {
        this.$el.style.left = ev.clientX;
        this.$el.style.top = ev.clientY;
        console.log(ev);
      });
    },
    stopmove(ev) {
      this.$el.removeEventListener("mousermove", function() {
        console.log(ev);
      });
    }
  }
};
</script>

<style>
.container {
  position: absolute;
  left: 300px;
  top: 200px;
  min-width: 50px;
  min-height: 50px;
  box-shadow: 3px;
  background: white;
}
.bar {
  width: 100%;
  height: 40px;
  background: rgba(49, 161, 253, 0.932);
}
.bar :hover {
  cursor: crosshair;
}
.title {
  float: left;
  margin: 5px;
}

.btns {
  float: right;
  margin: 5px;
}
</style>