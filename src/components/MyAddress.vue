<template>
<!-- 我的地址管理页面 -->
  <div>
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="router.back(-1)"
    />
    
    <!-- 地址卡片 -->
    <div class="AddressCard" v-for="item in state.addressData" :key="item.aid">
      <div class="CardLeft">
        <div class="name-phone">
          {{item.name}}&nbsp;{{item.tel}}&nbsp;
          <span class="default" v-if="item.isDefault">
          默认
          </span>
        </div>
        <div class="address">
          {{item.province}}{{item.city}}{{item.county}}{{item.addressDetail}}
        </div>
        
      </div>
      <!-- 点击修改 -->
      <div class="CardRight">
        <van-icon name="edit" color="gray" size="20" @click="editAddress(item.aid)"/>
      </div>
    </div>

    <!-- 底部新增地址按钮 -->
    <van-tabbar style="height: 60px;">
      <van-button round color="#0C34BA" 
                  style="width: 90%;margin: 8px auto;"  
                  type="primary" 
                  size="normal"
                  @click="router.push('/my/AddAddress')">
        新增地址
      </van-button>
    </van-tabbar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { onMounted, onBeforeUnmount, reactive } from "vue";
import { FindAddress } from "@/api/api"
const router = useRouter()
const store = useStore()
const state = reactive({
  addressData:'',
})

//  点击编辑按钮
const editAddress = (aid) =>{
  console.log(aid);
  store.commit('getAid',aid)
  router.push('/my/editAddress')
}

//  获取全部地址管理数据
const getFindAddress = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindAddress({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
  })
  console.log(data.result);
  state.addressData = data.result
}

onMounted(()=>{
  getFindAddress()
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})
</script>

<style lang="less" scoped>
.AddressCard{
  text-align: left;
  width: 92%;
  height: 70px;
  margin: 15px auto;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  .CardLeft{
    margin-left: 10px;
    // background-color: yellow;
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    
    .name-phone{
      font-size: 16px;
      display: flex;
      .default{
        background-color: #0C34BA;
        color: #fff;
        border-radius: 20px;
        padding: 0 5px 0 5px;
        font-size: 13px;
      }
    }
    .address{
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .CardRight{
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>