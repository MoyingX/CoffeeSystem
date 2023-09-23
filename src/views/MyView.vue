<template>
  <!-- 我的页面 -->
  <div>
    <!-- 登录前的页面 -->
    <div class="my" v-if="store.state.isLogin == 0">
      <!-- 背景图 -->
      <div class="bgimage">
        <img src="../assets/images/shopbag_bg.png" alt="">
      </div>
      <!-- 卡片 -->
      <div class="card">
        <div class="cardHeader">
          <!-- 头像 -->
          <div class="cardImg">
            <img src="../assets/images/未登录头像.jpg" alt="">
          </div>
          <!-- 昵称&个性签名 -->
          <div class="cardText">
            <div class="username">
              <span @click="router.push('/login')">点击登录</span>
            </div>
            <div class="signature">
              <span>欢迎使用瑞幸咖啡商城</span>
            </div>
          </div>
        </div>
        <!-- 可点击的跳转单元格 -->
        <van-cell-group style="text-align:left;" v-for="item in state.title" :key="item.index">
          <van-cell :title="'&nbsp;'+item.name" 
          is-link 
          @click="showToast({
              message: '您还未登录',
              icon: 'warning-o',
          })"/>
        </van-cell-group>
      </div>
    </div>


    <!-- 登录后的页面 -->
    <div class="my" v-for="item in state.userInfo" :key="item.nickName">
      <!-- 背景图 -->
      <div class="bgimage">
        <img src="../assets/images/Jay.jpg" alt="">
        <!-- <img :src="item.userBg" alt=""> -->
      </div>
      <!-- 卡片 -->
      <div class="card">
        <div class="cardHeader">

          <!-- 头像 -->
          <div class="cardImg">
            <!-- <img :src="item.userImg" alt="" @click="showImg = true"> -->
            <img src="../assets/images/橘猫.jpg" alt="" @click="showImg = true">
            <van-overlay :show="showImg" @click="showImg = false" >
              <img src="../assets/images/橘猫.jpg" class="bigImg" alt="">
            </van-overlay>
          </div>

          <!-- 昵称&个性签名 -->
          <div class="cardText">
            <div class="username">
              <span>{{ item.nickName }}</span>
            </div>
            <div class="signature">
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
        

        <!-- 可点击的跳转单元格 -->
        <van-cell-group style="text-align:left;" v-for="item in state.title" :key="item.index">
          <van-cell :title="'&nbsp;'+item.name" is-link @click="clickCell(item.index)"/>
        </van-cell-group>

      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive,ref } from "vue";
import { FindMy }from '@/api/api'
import { useRouter } from "vue-router";
import { showToast } from 'vant';
import { useStore } from "vuex";
const store = useStore()
const router = useRouter()

const showImg = ref(false);
const state = reactive({
  userInfo:null,
  title:
  [
    {
      name:'个人资料',
      index:1
    },{
      name:'我的订单',
      index:2
    },{
      name:'我的收藏',
      index:3
    },{
      name:'地址管理',
      index:4
    },{
      name:'安全中心',
      index:5
    }
  ]
})


//  点击下方单元格分别跳转
const clickCell = (index) =>{
  switch(index){
    case 1:router.push('/my/myprofile'); break;
    case 2:router.push('/my/myOrder'); break;
    case 3:router.push('/my/myCollection'); break;
    case 4:router.push('/my/myAddress'); break;
    case 5:router.push('/my/mySafety'); break;
  }
}

//  获取个人信息
const getFindMy = async() =>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindMy({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`
  })
  state.userInfo = data.result
  console.log(state.userInfo);
}

onMounted(()=>{
  getFindMy()
})
</script>

<style lang="less" scoped>
.my{
  background: #eee;
  height: 100vh;
  .bgimage{
    width: 100%;
    height: 150px;
    overflow: hidden;
    z-index: -1;
    img{
      margin: 0px auto;
      width:100%;
      z-index: -1;
    }
  }
  .card{
    background: rgba(255, 255, 255,0.5);
    padding-top: 10px;
    position: relative;
    margin: -40px auto;
    width: 95%;
    // border:1px solid black;
    z-index: 2000;
    border-radius: 15px 15px 0 0;
    .cardHeader{
      display: flex;
      margin-bottom: 45px;

      .cardImg{
        img{
          margin:0 20px 0 10px;
          width: 55px;
          border-radius: 50%;
        }
        .bigImg{
          position: relative;
          margin: 0 auto;
          width: 100%;
          border-radius:  0px;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
      .cardText{
        text-align: left;
        .username{
          color: #0C34BA;
          font-weight: bold;
          margin-top: 5px;
          margin-bottom: 10px;
        }
        .signature{
          font-size: 14px;
        }
      }
    }
    
  }
}

</style>