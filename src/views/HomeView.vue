<template>
  <!-- 首页页面 -->
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="headerLeft">
        <div class="date">
          {{date}}好
        </div>
        <div class="loginName" v-if="store.state.isLogin == 0" @click="router.push('/login')">
          {{ '登录' }}
        </div>
        <div class="loginName" v-if="store.state.isLogin == 1" @click="router.push('/my')">
          {{ state.username }}
        </div>
      </div>
      <van-search v-model="value" 
                  shape="round" 
                  style="width: 65%;" 
                  placeholder="点击搜索" 
                  @click="search"
      />
    </div>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in state.bannerList" :key="item.pid" @click="router.push('/detail?pid='+item.pid)">
        <van-image 
          :src="item.bannerImg"
        />
      </van-swipe-item>
    </van-swipe>

    <!-- 热门列表 -->
    <div class="hotList">
      <div class="hot" v-for="item in state.hotList" :key="item.id" @click="router.push('/detail?pid='+item.pid)"  >
        <div class="iconHot" v-if="item.isHot == 1">热卖</div>
        <img :src="item.smallImg" style="width: 175px;" alt=""><br>
        <span class="name">{{ item.name }}</span><br>
        <span class="enname">{{ item.enname }}</span>
        <span class="price">￥{{ item.price }}</span>
      </div>
    </div>

    <!-- 垫脚石 -->
    <div style="height: 50px;"></div>
  </div>
</template>

<script setup>
import '../assets/css/home.css'
import { Banner,TypeProducts,FindAccountInfo } from '../api/api';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()
const state = reactive({
  bannerList:[],
  hotList:[],
  username:'',
})


const value = ref('')

const date = computed(()=>{
  let mydate = new Date();
  let time = mydate.getHours();
  if(time >=6 && time<=10){
    return '上午'
  }else if(time >10 && time<=13){
    return '中午'
  }else if(time >13 && time<=18){
    return '下午'
  }else if(time >18 && time<24){
    return '晚上'
  }else{
    return '凌晨'
  }
})

// 获取轮播图的数据
const getBannerData = async()=>{
    const {data} = await Banner({
      appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='
    });
    // console.log(data);
    state.bannerList = data.result;
}


//  获取热门咖啡数据
const getTypeProducts = async()=>{
  const {data} = await TypeProducts({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    key:'isHot',
    value:1
  })
  console.log(data);
  state.hotList = data.result;
}


//  获取用户id
const getFindAccountInfo =  async()=>{
  if(localStorage.getItem('tokenString')){
    let tokenString = localStorage.getItem('tokenString')
    console.log(tokenString);
    const {data} = await FindAccountInfo({
      appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
      tokenString:`${tokenString}`
    })
    console.log(data);
    state.username = data.result[0].nickName
    console.log(state.username);
  }
}


//  点击搜索
const search = () =>{
  router.push('/search')
}


onMounted(async()=>{
    getBannerData();
    getTypeProducts();
    getFindAccountInfo();
})
</script>

<style lang="less" scoped>
.home{
  .header{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .headerLeft{
      display: flex;
      align-items: center;
      .date{
        margin-left: 15px;
        margin-right: 10px;
        font-size: 14px;
      }
      .loginName{
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .hotList{
    margin-top: 10px;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    background-color: #fff;
    .hot{
      width: 175px;
      text-align: left;
      margin-bottom: 10px;
      .iconHot{
        position: absolute;
        padding-left:3px;
        background-color: red;
        color: white;
        border-radius: 0 20px 20px 0;
        width: 35px;
        font-size: 14px;
      }
      .name{
        font-size: 15px;
      }
      .enname{
        display: block;
        width: 160px;
        font-size: 10px;
        color: gray;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price{
        display: block;
        margin-top: 5px;
        color: red;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
</style>