import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/style/global.less';
import i18n from '@/locales/useI18n'
import '@/utils/components_use'
import 'virtual:svg-icons-register';
import setupDefaultSetting from '@/utils/setupDefaultSetting'

// 原始cesium
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
// 全局设置Cesium token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZTEzNjM0Ni1mODAwLTQxYzEtODkwNC03MGI1ODljNWQyOGIiLCJpZCI6MTExMDAwLCJpYXQiOjE2NjU2NTAxODl9.5tUkOZC1dA4wPIgp0JopetBqLZ0mJb9BMyD-R0h610M";

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app');

const win: any = window
setupDefaultSetting()
if (process.env.NODE_ENV === 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
    win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
  }
}
