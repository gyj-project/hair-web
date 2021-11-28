<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router
        >
        
            <template v-for="item in items" >
                <template v-if="item.subs && item.role==1" >
                    <el-submenu :index="item.index" :key="item.index" >
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs " >
                            
                            <el-menu-item
                                    v-if="subItem.role==1"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon" v-if="item.role==1"></i>
                        <span slot="title" v-if="item.role==1">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                admin:false,
                collapse: false,
                items: [
                    {
                        role: 1,
                        icon: 'el-icon-lx-home',
                        index: 'queryBus',
                        title: '业务查询'
                    },
                    {
                        role: 1,
                        icon: 'el-icon-lx-cascades',
                        index: '1',
                        title: '预约中心',
                        subs: [
                           
                            {
                                role:1,
                                index: 'reservation',
                                title: '预约查询'
                            },
                            {
                                role:1,
                                index: 'myReservation',
                                title: '我的预约'
                            },
                            {
                                role:1,
                                index: 'queryBroken',
                                title: '违约记录'
                            }
                        ]
                    },
                    {
                        role: 1,
                        icon: 'el-icon-bell',
                        index: 'notice',
                        title: '消息通知'
                    },
                    {
                        role: 1,
                        icon: 'el-icon-shopping-cart-2',
                        index: 'queryGoods',
                        title: '商品出售'
                    },
                    {
                        role: 1,
                        icon: 'el-icon-setting',
                        index: '3',
                        title: '系统管理',
                        subs: [
                            {
                                role:1,
                                index: 'empManager',
                                title: '员工管理'
                            },
                            {
                                role:1,
                                index: 'userManager',
                                title: '会员管理'
                            }, 
                            {
                                role:1,
                                index: 'busManager',
                                title: '业务管理'
                            },
                            {
                                role:1,
                                index: 'skillManager',
                                title: '技能分配'
                            }
                        ]
                    },  
                    {
                        role: 1, 
                        icon: 'el-icon-document',
                        index: 'queryOrder',
                        title: '订单查询'
                    },
                    {
                        role: 1, 
                        icon: 'el-icon-lx-emoji',
                        index: 'leaveMsg',
                        title: '发布信息'
                    },
                    
                    
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            var roleId = sessionStorage.getItem('loginRole');
            this.items[4].role = roleId;
            this.items[5].role = roleId;
            this.items[6].role = roleId;
            this.items[1].subs[2].role = roleId;
          
            //alert(this.items[1].subs[2].role)
          
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            // bus.$on('collapse', msg => {
            //     this.collapse = msg;
            //     bus.$emit('collapse-content', msg);
            // });
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
