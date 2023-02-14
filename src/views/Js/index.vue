<template>
  <section class="Js">
    1
  </section>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import * as api from './service'


const JsState = reactive({
  form: {},
  num: 1,
  str: '2',
  nul: null,
  ss: undefined
})

onMounted(() => {
  function Fun() {

  }
  console.log(Fun.prototype);//默认指向一个Object空对象（没有我们的属性）

  // // 原型对象中有一个属性constructor，它指向函数对象
  console.log(Date.prototype.constructor === Date);
  // console.log(Fun.prototype.constructor === Fun);

  // // 给原型对象添加属性（一般是方法）--> 实例对象可以访问
  // Fun.prototype.test = function () {
  //   console.log('test()');
  // }

  // var fun = new Fun();
  // fun.test();
})

</script>

<style lang="less" scoped>
.Js {}
</style>
