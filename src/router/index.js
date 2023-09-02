import { createRouter,createWebHashHistory } from "vue-router";

const routes = [
    {
        path:'/',
        name:'tabber',
        component:()=>import('../views/TabBar.vue'),
        children:[
            {
                path:'/',
                name:'home',
                alias:'/home',
                component:()=>import('../views/HomeView.vue'),
            },
            {
                path:'/menu',
                name:'menu',
                component:()=>import('../views/MenuView.vue'),
            },
            {
                path:'/shopcar',
                name:'shopcar',
                component:()=>import('../views/ShopView.vue'),
            },
            {
                path:'/my',
                name:'my',
                component:()=>import('../views/MyView.vue'),
            },
        ]
    },
    {   //登录页面
        path:'/login',
        name:'login',
        component:()=>import('../views/Login.vue'),
    },
    {   //详情页面
        path:'/detail',
        name:'detail',
        component:()=>import('../views/ShopDetail.vue'),
    },
    {   //搜索页面
        path:'/search',
        name:'search',
        component:()=>import('../views/SearchView.vue'),
    },

    //  我的页面里面的内容路由
    {   //  个人资料页面
        path:'/my/myProfile',
        name:'myProfile',
        component:()=>import('../components/MyProfile.vue'),
    },
    {   //  我的订单页面
        path:'/my/myOrder',
        name:'myOrder',
        component:()=>import('../components/MyOrder.vue'),
    },
    {   //  我的收藏页面
        path:'/my/myCollection',
        name:'myCollection',
        component:()=>import('../components/MyCollection.vue'),
    },  
    {   //  地址管理页面
        path:'/my/myAddress',
        name:'myAddress',
        component:()=>import('../components/MyAddress.vue'),
    },

    {   //  我的安全中心
        path:'/my/mySafety',
        name:'mySafety',
        component:()=>import('../components/MySafety.vue'),
    },
    {   //  安全中心页面
        path:'/shopcar/sumbit',
        name:'sumbit',
        component:()=>import('../components/Submit.vue'),
    },
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router;