<template>
  <a-form class="form" ref="formRef" :layout="props.layout" :model="state.BindFrom"
    v-if="formState.intoFrom.length > 0">
    <a-form-item v-for="item in formState.intoFrom" :key="item.id" :label="item?.label"
      :rules="selectRules(item.required, item.message, item.type) || []" :name="item.key">
      <!-- 输入框，下拉框 -->
      <a-input v-if="item.type === types[0]" v-model:value="state.BindFrom[item.key]" :rows="item.row || 1" />
      <a-select v-if="item.type === types[1]" v-model:value="state.BindFrom[item.key]"
        placeholder="please select your zone">
        <a-select-option v-for="elemet in item.list || []" :value="elemet?.value">{{ elemet?.label }}</a-select-option>
      </a-select>

      <!-- 时间选择 参数dateType格式 range时间段-->
      <a-date-picker v-if="item.type === types[2]" v-model:value="state.BindFrom[item.key]"
        :valueFormat="item.valueFormat || 'YYYY/MM/DD HH:mm:ss'" show-time
        :format="item.format || 'YYYY/MM/DD HH:mm:ss'" style="width: 100%" />

      <a-range-picker v-if="item.type === types[3]" v-model:value="state.BindFrom[item.key]" style="width: 100%"
        show-time :format="item.format || 'YYYY/MM/DD HH:mm:ss'"
        :valueFormat="item.valueFormat || 'YYYY/MM/DD HH:mm:ss'" />
      <!-- 滑块 -->
      <a-switch v-if="item.type === types[4]" v-model:checked="state.BindFrom[item.key]" />
      <!-- 多选 -->
      <a-checkbox-group v-model:value="state.BindFrom[item.key]" v-if="item.type === types[5]">
        <a-checkbox v-for="elemet in item.list || []" :value="elemet?.value">{{
          elemet?.label
        }}</a-checkbox>
      </a-checkbox-group>
      <!-- 单选 -->
      <a-radio-group v-model:value="state.BindFrom[item.key]" v-if="item.type === types[6]">
        <a-radio v-for="elemet in item.list || []" :value="elemet?.value">{{
          elemet?.label
        }}</a-radio>
      </a-radio-group>

      <!-- 任意插槽 -->
      <slot :name="item.solt"></slot>
    </a-form-item>

    <slot name="footer">
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="submitForm">Submit</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
      </a-form-item>
    </slot> <!-- 插槽出口 -->

  </a-form>
</template>
<script lang="ts" setup>
import { FormInstance } from 'ant-design-vue';
import { reactive, watch, ref } from 'vue'
import { formState, types, isArrayType } from './helper'

const formRef = ref<FormInstance>();
const props = defineProps({
  form: {
    type: Array,
    default: []
  },
  //布局方式
  layout: {
    type: String,
    default: ''
  }
});

const state = reactive({
  BindFrom: {}
})

const emit = defineEmits(['setData'])
function submitForm() {
  emit('setData', state.BindFrom)
}

function resetForm() {
  formRef.value?.resetFields();
}


function selectRules(required, message, type) {
  if (type != 'slot') {
    let Irule = {
      required: required || false,
      message: message || '请输入内容',
    }
    if (isArrayType.includes(type)) {
      Irule['type'] = 'array'
      Irule.message = message || '请选择内容'
    }
    return [Irule]
  }
  return
}


watch(
  () => props.form,
  (val) => {
    //解析传进来的数组数据，绑定为BindFrom
    formState.intoFrom = val
    let data = {}
    if (val.length > 0) {
      val.forEach((item: any) => {
        //插槽不解析
        if (item.type != 'slot') {
          data[item.key] = item.value
        }
      })
    }
    console.log(formState.intoFrom);
    state.BindFrom = data
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less">

</style>
