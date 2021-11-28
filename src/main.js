import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import _axios from '@/utils/_axios';
import store from './store/store'
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';

import 'babel-polyfill';
import axios from 'axios'
Vue.prototype.$axios = axios;
import  VueResource  from 'vue-resource'
Vue.use(VueResource)


Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

// //使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = sessionStorage.getItem('loginName');
//     if (role == null && to.path == '/login') { // 如果没登录去登录
//         next();
//     } else if (role == null && to.path == '/regist') { // 如果没登录去注册
//         next();
//     } else if (role == null && to.path != '/regist' && to.path != '/login') {  //如果没登录去主页
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         next('/login');
//     } else {
//         next();
//     }
// });

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');


