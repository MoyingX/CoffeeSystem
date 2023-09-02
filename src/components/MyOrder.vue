<template>
<!-- 我的订单页面 -->
  <div class="myOrder">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="router.push('/my')"
    />
    <div class="bg"></div>
    <van-tabs class="tabs" v-model:active="active" @click="clickTabs">

      <!-- 全部订单 -->
      <van-tab title="全部">
        <van-empty v-if="state.allOrderList == ''" description="没有订单数据" />
        <div v-else class="AllOrderList">
          <div class="AllOrderHeader">
            <div class="AllOrderHeadertitle">
              订单信息
            </div>
          </div>
          <div class="AllOrderCard" v-for="item in state.allOrderList" :key="item.id">
            <div class="oid">
              <div>
                订单编号：{{ item.oid }}
              </div>
              <!-- <div @click="clickReceive(item.oid)" >
                确认收货
              </div> -->
            </div>
            <div style="display: flex;">
            <img :src="item.smallImg" style="width: 82px;" alt="">
              <div style="margin-left: 10px;">
                <div class="name">{{ item.name }}&emsp;<span style="color: gray;">{{ item.rule }}</span></div>
                <div class="enname">{{ item.enname }}</div>
                <div class="footer">
                  <div class="price">￥{{ item.price }}</div>
                  <div class="count">x{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <van-divider dashed
          :style="{ color: '#1989fa', borderColor: 'rgb(128,128,128)', padding: '0 16px' }"
          >
          </van-divider>
          <div class="AllOrderFooter">
            <div class="time">
              2022-05-01 18:22:49
            </div>
            <div class="AllOrderFooterContent">
              <div>共计 {{allOrderCount}} 件商品</div>
              <div style="color: red;font-weight: bold;">订单金额：￥{{allOrderPrice.toFixed(2)}}</div>
            </div>
          </div>
        </div>
      </van-tab>

      <!-- 进行中的订单 -->
      <van-tab title="进行中">
        <van-empty v-if="state.allOrderList == ''" description="没有订单数据" />
        <div v-else class="AllOrderList">
          <div class="AllOrderHeader">
            <div class="AllOrderHeadertitle">
              订单信息
            </div>
          </div>
          <div class="AllOrderCard" v-for="item in state.allOrderList" :key="item.id">
            <div class="oid">
              <div>
                订单编号：{{ item.oid }}
              </div>
              <div v-if="state.showRight" @click="clickReceive(item.oid)">
                确认收货
              </div>
            </div>
            <div style="display: flex;">
            <img :src="item.smallImg" style="width: 82px;" alt="">
              <div style="margin-left: 10px;">
                <div class="name">{{ item.name }}&emsp;<span style="color: gray;">{{ item.rule }}</span></div>
                <div class="enname">{{ item.enname }}</div>
                <div class="footer">
                  <div class="price">￥{{ item.price }}</div>
                  <div class="count">x{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <van-divider dashed
          :style="{ color: '#1989fa', borderColor: 'rgb(128,128,128)', padding: '0 16px' }"
          >
          </van-divider>
          <div class="AllOrderFooter">
            <div class="time">
              2022-05-01 18:22:49
            </div>
            <div class="AllOrderFooterContent">
              <div>共计 {{allOrderCount}} 件商品</div>
              <div style="color: red;font-weight: bold;">订单金额：￥{{allOrderPrice.toFixed(2)}}</div>
            </div>
          </div>
        </div>
      </van-tab>

      <!-- 已完成的订单 -->
      <van-tab title="已完成">
        <van-empty v-if="state.allOrderList == ''" description="没有订单数据" />
        <div v-else class="AllOrderList">
          <div class="AllOrderHeader">
            <div class="AllOrderHeadertitle">
              订单信息
            </div>
          </div>
          <div class="AllOrderCard" v-for="item in state.allOrderList" :key="item.id">
            <div class="oid">
              <div>
                订单编号：{{ item.oid }}
              </div>
              <div style="display: flex; align-items: center;">
                <div>已完成&nbsp;</div> 
                <van-icon name="delete-o" size="20" @click="removeOrder(item.oid)"/>
              </div>
            </div>
            <div style="display: flex;">
            <img :src="item.smallImg" style="width: 82px;" alt="">
              <div style="margin-left: 10px;">
                <div class="name">{{ item.name }}&emsp;<span style="color: gray;">{{ item.rule }}</span></div>
                <div class="enname">{{ item.enname }}</div>
                <div class="footer">
                  <div class="price">￥{{ item.price }}</div>
                  <div class="count">x{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <van-divider dashed
          :style="{ color: '#1989fa', borderColor: 'rgb(128,128,128)', padding: '0 16px' }"
          >
          </van-divider>
          <div class="AllOrderFooter">
            <div class="time">
              2022-05-01 18:22:49
            </div>
            <div class="AllOrderFooterContent">
              <div>共计 {{allOrderCount}} 件商品</div>
              <div style="color: red;font-weight: bold;">订单金额：￥{{allOrderPrice.toFixed(2)}}</div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { reactive, ref,onMounted,onBeforeUnmount,computed } from 'vue';
import { FindOrder,Receive,RemoveOrder } from '@/api/api'
import { useRouter } from 'vue-router'
import { showConfirmDialog,showSuccessToast } from 'vant';
const router = useRouter()
const state = reactive({
  allOrderList:'',

  oid:'',     // 确认收货需要的oid
  rmoid:'',   //  删除订单需要的oid

  isReceive:0,   //  是否确认收货
  showRight:0   //  订单右边按钮延时显示
})
const active = ref(0);

//  计算全部订单商品总数量
const allOrderCount = computed(()=>{
    let count = 0
    for(let i=0;i<state.allOrderList.length;i++){
        count = state.allOrderList[i].count + count
    }
    return count;
})

//  计算全部订单商品总价格
const allOrderPrice = computed(()=>{
    let allPrice = 0
    for(let i=0;i<state.allOrderList.length;i++){
        let price = (state.allOrderList[i].price) * (state.allOrderList[i].count)
        allPrice = allPrice + price
    }
    return allPrice;
})



//  监听tabs点击事件切换获取数据
const clickTabs = ()=>{
  getFindOrder()
  setTimeout(()=>{
    state.showRight = 1
  },800)
}


//  点击确认收货
const clickReceive =(oid)=>{
  showConfirmDialog({
    title: '确认收货吗？',
  })
    .then(() => {
      state.oid = oid
      useReceive()
      showSuccessToast('收货成功')
      state.isReceive = 1
      setTimeout(()=>{
        getFindOrder()
      },500)
    })
    .catch(() => {
      // on cancel
    });
  
}

//  点击垃圾桶删除订单
const removeOrder =(oid)=>{
  showConfirmDialog({
    title: '确认删除该订单吗？',
  })
    .then(() => {
      state.rmoid = oid
      useRemoveOrder()
      showSuccessToast('删除订单成功')
      setTimeout(()=>{
        getFindOrder()
      },500)
    })
    .catch(() => {
      // on cancel
    });
}




//  获取订单数据
const getFindOrder = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  let status = 0
  if(active.value == 0) {status = 0}
  if(active.value == 1) {status = 1}
  if(active.value == 2) {status = 2}
  const {data} = await FindOrder({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    status:status
  })
  state.allOrderList = data.result
  console.log(state.allOrderList);
}

//  确认收货功能
const useReceive = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await Receive({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    oid:`${state.oid}`
  })
  console.log(data);
}

//  删除订单功能
const useRemoveOrder = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await RemoveOrder({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    oid: `${state.rmoid}`
  })
  console.log(data);
}

onMounted(() => {
  getFindOrder()
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})

</script>



<style lang="less" scoped>
.myOrder{
  text-align: left;
  .bg{
    width: 100%;
    height: 120px;
    background-color: #0C34BA;
  }
  .tabs{
    width: 95%;
    margin: -20px auto;
    .AllOrderList{
      margin-top: 15px;
      width: 100%;
      background-color: #fff;
      .AllOrderHeader{
        padding-top: 20px;
        padding-bottom: 10px;
        margin: 0 auto;
        width: 95%;
        .AllOrderHeadertitle{
          font-size: 14px;
          font-weight: bold;
        }
        
      }
      .AllOrderCard{
        width: 95%;
        margin: 0 auto;
        margin-bottom: 15px;
        .oid{
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: gray;
          margin-bottom: 5px;
        }
        .name{
          font-size: 15px;
        }
        .enname{
          font-size: 10px;
          width: 230px;
          color: gray;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .footer{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price{
            margin-top: 25px;
            color: red;
            font-weight: bold;
            font-size: 14px;
          }
          .count{
            margin-top: 25px;
            font-size: 12px;
          }
        }
        
      }
      .AllOrderFooter{
        width: 95%;
        margin: 0 auto;
        height: 80px;
        font-size: 14px;
        .AllOrderFooterContent{
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}


</style>