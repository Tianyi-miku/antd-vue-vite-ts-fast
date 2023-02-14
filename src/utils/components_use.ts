//bug:todo不知道为什么notification引入之后没有css样式,怀疑和AntDesignVueResolver有关
// 答:目前已使用nplugin-vue-components插件并且已配置include: [/\.vue$/,/\.tsx$/],table没有样式的问题得到解决,继续观察其他组件,如果没有问题,下面三行也不需要了
import "ant-design-vue/lib/notification/style/index.css";
import "ant-design-vue/lib/message/style/index.css";
import "ant-design-vue/lib/modal/style/index.css";

//插件使用的element-ui，懒得修改了，需要改的自行修改,组件中的警告也是因为vue2组件不兼容，项目中遇到之后建议根据执行需求修改
import 'element-plus/dist/index.css'
