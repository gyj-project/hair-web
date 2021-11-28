import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);


const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/welcome'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/welcome',
                    name: 'welcome',
                    component: () => import( '../components/page/welcome.vue')
                },
                {
                    path: '/empManager',
                    component: () => import( '../components/page/empManager.vue'),
                    meta: { title: '员工管理' }
                },
                {
                    path: '/queryBus',
                    component: () => import( '../components/page/queryBus.vue'),
                    meta: { title: '业务查询' }
                },
                {
                    path: '/userManager',
                    component: () => import( '../components/page/userManager.vue'),
                    meta: { title: '会员管理' }
                },
                {
                    path: '/notice',
                    component: () => import( '../components/page/notice.vue'),
                    name: 'notice',
                    meta: { title: '消息通知' }
                },
                {
                    // 富文本编辑器组件
                    path: '/leaveMsg',
                    component: () => import( '../components/page/leaveMsg.vue'),
                    meta: { title: '发布通知' }
                },
                {
                    // 业务管理
                    path: '/busManager',
                    component: () => import( '../components/page/busManager.vue'),
                    meta: { title: '业务管理' }
                },
                {
                    // 技能分配
                    path: '/skillManager',
                    component: () => import( '../components/page/skillManager.vue'),
                    meta: { title: '技能分配' }
                },
                {
                    // 预约中心
                    path: '/reservation',
                    component: () => import( '../components/page/reservation.vue'),
                    meta: { title: '预约查询' }
                },
                {
                    // 预约中心
                    path: '/myReservation',
                    component: () => import( '../components/page/myReservation.vue'),
                    meta: { title: '我的预约' }
                },
                {
                    // 违约查询
                    path: '/queryBroken',
                    component: () => import( '../components/page/queryBroken.vue'),
                    meta: { title: '违约记录' }
                },
                {
                    // 信息详情
                    path: '/publishInfo',
                    name: 'publishInfo',
                    component: () => import( '../components/page/publishInfo.vue'),
                    meta: { title: '信息详情' }
                },
                {
                    // 商品出售
                    path: '/queryGoods',
                    component: () => import( '../components/page/queryGoods.vue'),
                    meta: { title: '商品出售' }
                },
                {
                    // 订单查询
                    path: '/queryOrder',
                    component: () => import( '../components/page/queryOrder.vue'),
                    meta: { title: '订单查询' }
                },
                {
                    path: '/404',
                    component: () => import( '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import( '../components/page/403.vue'),
                    meta: { title: '403' }
                },
               
            ]
        },
        {
            path: '/login',
            component: () => import( '../components/page/login.vue')
        },
        {
            path: '/regist',
            component: () => import( '../components/page/regist.vue')
        },
        {
            path: '*',
            redirect: '/404'
        },
        
        
    ]
});


//当当前token为空时，不允许访问其他页面，直接跳转到登录页面
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    }  else if(to.path === '/regist') {
        next();
    } else {
         let token = localStorage.getItem('Authorization');
         if (token === null || token === '') {
            next('/login');
         } else {
            next()
         }
    }
})

export default router;
