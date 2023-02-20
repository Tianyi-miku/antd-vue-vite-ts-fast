<template>
  <div>
    <a-button @click="debounce(1000, isdebounce, '防抖')">debounce</a-button>

    <a-button @click="throttle(1000, isdebounce, '节流')">throttle</a-button>

  </div>
</template>

<script lang="ts" setup>
import cache from '@antv/util/lib/cache';
import { message } from 'ant-design-vue';
import { rejects } from 'assert';
import { resolve } from 'path';
import { ref, reactive, onMounted } from 'vue'
// import * as api from './service'


function isdebounce(arg) {
  message.success(`简单${arg}，平常项目用loadhash`)
}

let timer
// 防抖
function debounce(time, fun, arg) {
  if (!timer) {
    fun(arg)
  }
  timer = setTimeout(() => {
    timer = null
  }, time);
}

let throttletimer
// 节流
function throttle(time, fun, arg) {
  if (!throttletimer) {
    fun(arg)
  }
  throttletimer = setTimeout(() => {
    throttletimer = null
  }, time);

}

//手动实现promise
//promise pending, fulfilled, rejected 三个状态

// function _Promise(fn) {
//   let stash = 'pending' //初始状态
//   let value = null
//   let reason = null
//   let onFulfilled = []
//   let onReject = []

// }



onMounted(() => {
  // (async () => {
  //   for (let index = 0; index < 9; index++) {
  //     await new Promise(function (resolve, rejected) {
  //       console.log(index + 1);
  //       setTimeout(resolve, 1000);
  //     })
  //   }
  // })()

  // for (let index = 0; index < 5; index++) {
  //   setTimeout(() => {
  //     console.log(index);
  //   }, 1000);
  // }
  for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      console.log(i)
    }, 1000)
  };


})

</script>

<style lang="less" scoped>
</style>
