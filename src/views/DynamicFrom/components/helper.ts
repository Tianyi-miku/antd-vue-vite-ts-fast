import { reactive } from 'vue'
import { formStateType } from "../types";

export const formState = reactive<formStateType>({
  intoFrom: []
})

export const types = ['input', 'select', 'time', 'range', 'switch', 'checkbox', 'radio', 'slot'] //输入框，下拉框, 时间选择，滑块，多选，单选，插槽

export const isArrayType = ['range', 'checkbox']


// const FormData = [
//   {
//     type: 'select',  类型
//     label: '名称',  前置按钮
//     key: 'name',    对象key值
//     value: '',      对象value值
//     required: true,  是否校验
//     message : '',   校验提示
//     list: [] , 循环列表，下拉框或者多选，单选
// ]
