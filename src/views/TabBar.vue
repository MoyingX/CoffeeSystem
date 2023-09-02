<template>
  <div>
    <div>
        <router-view></router-view>
    </div>
    <van-tabbar v-model="state.active" route>
        <van-tabbar-item v-for="item in state.tabList" :key="item.name" :name="item.name" :to="item.to">
            <span>{{ item.text }}</span>
            <template #icon="props">
                <img :src="props.active ? item.icon.inactive : item.icon.active" alt="">
            </template>
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const state = reactive({
    active:0,
    tabList:[
        {
            name:'home',
            to:'/home',
            text:'首页',
            icon:{
                active:require('../assets/images/home.png'),
                inactive:require('../assets/images/home_active.png')
            }
        },
        {
            name:'menu',
            to:'/menu',
            text:'分类',
            icon:{
                active:require('../assets/images/menu.png'),
                inactive:require('../assets/images/menu_active.png')
            }
        },
        {
            name:'shopcar',
            to:'/shopcar',
            text:'购物车',
            icon:{
                active:require('../assets/images/shopbag.png'),
                inactive:require('../assets/images/shopbag_active.png')
            }
        },
        {
            name:'my',
            to:'/my',
            text:'我的',
            icon:{
                active:require('../assets/images/my.png'),
                inactive:require('../assets/images/my_active.png')
            }
        },
    ]
})

</script>

<style>

</style>