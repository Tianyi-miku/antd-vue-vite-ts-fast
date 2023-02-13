<template>
  <section class="D3js">

    123
  </section>
</template>

<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted } from 'vue'
// import * as api from './service'


function addline() {
  let svg = d3.select('body')
    .append('svg')
    .attr('width', 1000 + 'px')
    .attr('height', 500 + 'px');

}
</script>

<style lang="less" scoped>
.D3js {}
</style>
