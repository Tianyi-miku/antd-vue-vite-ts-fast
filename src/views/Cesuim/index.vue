<template>
  <div class="Cesuim" id="cesiumContainer">
    <div class="content">
      <a-button>雪天</a-button>
      <a-button>雨天</a-button>

      <a-button>扫描</a-button>
      <a-button>波动</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { loadView } from "./hooks";

onMounted(() => {
  loadView()
})
</script>

<style lang="less" scoped>
#cesiumContainer {
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
}

.content {
  position: absolute;
  color: aliceblue;
  position: absolute;
  z-index: 1000;
}
</style>
