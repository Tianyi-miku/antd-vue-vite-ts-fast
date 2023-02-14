<template>
  <dynamicForm ref="dynamicForm" :form="Istate.FormData" :layout="'horizontal'" @setData="setData" class="DynamicFrom">
    <template v-slot:anyone>
      <a-form-item label="anyone">
        <a-input v-model:value="Istate.form.anyone" />
      </a-form-item>
    </template>
  </dynamicForm>
</template>

<script lang="ts" setup>
// import { ref, reactive } from 'vue'
// import * as api from './service'
import { message } from "ant-design-vue";
import { reactive, onMounted } from "vue";
import dynamicForm from "./components/form.vue";

type types = {
  FormData: Array<any>,
  form: {
    anyone: String
  }
}

const Istate = reactive<types>({
  form: {
    anyone: ''
  },
  FormData: [
    {
      type: 'input',
      label: '名称',
      key: 'name',
      value: '',
      required: true
    },
    {
      type: 'select',
      label: '性别',
      key: 'sex',
      value: '',
      required: true,
      list: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    },
    {
      type: 'time',
      label: '单个时间',
      key: 'startTime',
      value: '',
      required: true,
    },
    {
      type: 'range',
      label: '多个时间',
      key: 'times',
      value: [],
      required: true,
    },
    {
      type: 'switch',
      label: '滑块',
      key: 'isshow',
      value: 'false',
      required: true,
    },
    {
      type: 'checkbox',
      label: '多选',
      key: 'checkbox',
      required: true,
      value: [],
      list: [
        {
          label: '北京',
          value: 1
        },
        {
          label: '上海',
          value: 2
        },
      ]
    },
    {
      type: 'radio',
      label: '单选',
      key: 'radio',
      required: true,
      value: [],
      list: [
        {
          label: '成都',
          value: 1
        },
        {
          label: '昆明',
          value: 2
        },
      ]
    },
    {
      type: 'slot',
      solt: "anyone" //插槽名称与上面自己写的名称对应
    },
  ]
})

onMounted(() => {

})


function setData(data) {
  //插槽数据合并
  Object.assign(Istate.form, data)
  message.info(JSON.stringify((Istate.form)))
}

</script>

<style lang="less" scoped>
.DynamicFrom {
  width: 40%;
  margin: auto;
}
</style>
