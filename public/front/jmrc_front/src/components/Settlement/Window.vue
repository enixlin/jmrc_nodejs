<template>
  <div>
    <vue-draggable-resizable
      ref="window"
      :prevent-deactivation="false"
      @activated="onActivated"
      @deactivated="onDeactivated"
      :disableUserSelect="false"
      :handles="[]"
      :z="z"
    >
      <div class="container">
        <div class="bar" @click="clickbar">
          {{ title }}
          <div style="float:right" @click="close">x</div>
        </div>
        <slot></slot>
      </div>
    </vue-draggable-resizable>
  </div>
</template>
<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import eventBus from "./../../Utils/EventBus.js";

export default {
  data() {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      z: 0
    };
  },
  props: { title: String },
  components: {
    VueDraggableResizable
  },
  methods: {
    onDeactivated() {
      console.log("click Deactive");
      this.z = 99;
    },
    onActivated() {
      console.log("click active");
      this.z = 100;
    },
    clickbar() {
      this.draggable = true;
    },

    close() {
      eventBus.$emit("closeWindow", this.title);
    },
    onResize: function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    onDrag: function(x, y) {
      this.x = x;
      this.y = y;
      console.log(this.$refs);

      this.$refs.window.style.opacity = 0.3;
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: inherit;
  border: 1px solid #abcabc;
  box-shadow: gray;
  background: white;
}
.bar {
  width: 100%;
  height: 20px;
  background: #118bfd;
}
</style
>>
