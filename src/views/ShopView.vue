<template>
  <!-- 购物车页面 -->
  <div class="shopcar">
    <!-- 头部 -->
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      :right-text="state.isEdit?'完成':'编辑'"
      left-arrow
      @click-left="router.back(-1)"
      @click-right="edit"
    />

    <img src="../assets/images/shopbag_bg.png" style="width: 100%;" alt="">

    <!-- 未登录的页面 -->
    <van-empty v-if="store.state.isLogin == 0" image="error" description="请先登录">
      <van-button round type="primary" class="bottom-button" @click="router.push('/login')">去登录</van-button>
    </van-empty>

    <!-- 已登录的页面 -->
    <!-- 无商品 -->
    <van-empty v-if="store.state.isLogin == 1 && state.shopcarList == ''" description="购物车内无商品" />
    <!-- 有商品 -->     <!--卡片-->
    <div v-if="store.state.isLogin == 1">
      <van-checkbox-group v-model="checked" ref="checkboxGroup">
        <van-cell-group inset style="background-color: #eee;">
          <van-cell v-for="(item,index) in state.shopcarList" 
                                :key="item" class="cell" 
                                clickable 
                                @click="select"
                                >
              <!-- 内容 -->
              <template #right-icon>
                <van-checkbox
                  :name="item"
                  :ref="el => checkboxRefs[index] = el"
                />
                <div class="card">
                  <img :src="item.small_img" style="width:80px" alt="">
                  <div class="text">
                    <div class="name">{{ item.name }}&nbsp;&nbsp;<span style="color: gray;font-size: 12px;">{{ item.rule }}</span></div>
                    <div class="enname">{{ item.enname }}</div>
                    <div class="footer">
                      <div class="price">￥{{ (item.price*item.count).toFixed(2) }}</div>
                      <van-stepper v-model="item.count" theme="round" button-size="22" disable-input @click="changeCount(item.count,item.sid)"/>
                    </div>
                  </div>
                </div>
              </template>

          </van-cell>
        </van-cell-group>
      </van-checkbox-group>

      <!-- 垫脚石 -->
      <div style="height: 100px;"></div>

      <!-- 尾部：提交订单 -->
      <van-submit-bar style="margin-bottom: 50px;" :price="AllPrice" :button-text="state.isEdit?'删除选择':'提交订单'" @submit="onSubmit">
        <van-checkbox v-model="state.isAllSelect" @click="AllSelect" :style="state.isEdit?'margin-right: 51.6%;':''">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script setup>
import { FindAllShopcart,ModifyShopcartCount,RemoveShopcart } from '@/api/api';
import { onMounted, reactive,ref,onBeforeUpdate, computed,onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog } from 'vant';
import { showToast } from 'vant';
import { useStore } from 'vuex';
const store = useStore()
const router = useRouter()

const checked = ref([]);  //  复选框选择后的数据
const checkboxRefs = ref([]);
const checkboxGroup = ref(null);
onBeforeUpdate(() => {
  checkboxRefs.value = [];

});
// 
const state = reactive({
  shopcarList:'',   //获取的购物车列表
  count:'',   // 单个商品的数量
  sid:'',     // 单个商品唯一标志
  isAllSelect:0,  //  是否全选

  isEdit:0,   //  是否在编辑的状态下
})


//  下方提交按钮 && 删除选择按钮
const onSubmit = () => {
  //  下方提交按钮
  if(!state.isEdit){  
    if(checked.value.length == 0){
      showToast('您还没有选择商品！');
      return
    }
    showConfirmDialog({
      title: '是否提交订单',
    })
      .then(() => {
        console.log('提交订单');
        console.log(checked.value);
        let sids = []
        for(let i=0;i<checked.value.length;i++){
          console.log(checked.value[i].sid);
          sids.push(checked.value[i].sid)
        }
        store.commit('addsids',sids)
        router.push('/shopcar/sumbit')
      })
      .catch(() => {
        // on cancel
      });
    
  }else{
    //  删除选择按钮
    if(checked.value.length == 0){
      showToast('您还没有选择您要删除的商品！');
      return
    }
    showConfirmDialog({
      title: '是否删除？',
    })
      .then(() => {
        useRemoveShopcart()
        setTimeout(()=>{
          getFindAllShopcart()
        },500)
      })
      .catch(() => {
        // on cancel
      });
  }
}


//  显示总价格
const AllPrice =computed(()=>{
  if(state.isEdit) return
  let allPrice = 0
  // for(let i=0;i<state.shopcarList.length;i++){
  //   let Price = (state.shopcarList[i].count) * (state.shopcarList[i].price)
  //   allPrice = allPrice + Price
  // }
  for(let i=0;i<checked.value.length;i++){
    let Price = (checked.value[i].count) * (checked.value[i].price)
    allPrice = allPrice + Price
  }
  return allPrice*100
})


//  编辑按钮
const edit = ()=>{
  state.isEdit =!state.isEdit
  checkboxGroup.value.toggleAll(false);
  state.isAllSelect = 0
}

//  单选与全选的互相控制
const select = ()=>{
  console.log(checked.value);
  

  if(checked.value.length != state.shopcarList.length){
    state.isAllSelect = 0
  }else{
    state.isAllSelect = 1
  }
}

//  全选
const AllSelect =() =>{
  state.isAllSelect ==!state.isAllSelect
  
  if(state.isAllSelect){
    checkboxGroup.value.toggleAll(true);
  }else{
    checkboxGroup.value.toggleAll(false);
  }
}

//  点击修改商品数量
const changeCount =(count,sid)=>{
  state.sid = sid
  state.count = count
  useModifyShopcartCount()
}

//  查询用户所有购物车条数
const getFindAllShopcart = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindAllShopcart({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`
  })
  state.shopcarList = data.result
  console.log(state.shopcarList);
}

//  修改购物车商品数量功能
const useModifyShopcartCount = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await ModifyShopcartCount({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    sid:`${state.sid}`,
    count:`${state.count}`
  })
  console.log('修改数量成功');
}

//  删除一个或者多个购物车商品功能
const useRemoveShopcart = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  let sids = []
  for(let i=0;i<checked.value.length;i++){
    console.log(checked.value[i].sid);
    sids.push(checked.value[i].sid)
  }
  
  const {data} = await RemoveShopcart({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    sids:JSON.stringify(sids)
  }) 
}


onMounted(() => {
  getFindAllShopcart()
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})
</script>

<style lang="less" scoped>
.shopcar{
  background-color: #eee;
  text-align: left;
  .cell{
    margin: 10px auto;
    border-radius: 10px;
    width: 100%;
    .card{
      margin-left: 10px;
      height: 80px;
      display: flex;
      .text{
        margin-left: 10px;
        .name{
          font-size: 15px;
        }
        .enname{
          font-size: 10px;
          width: 170px;
          color: gray;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .footer{
          display: flex;
          width: 190px;
          justify-content: space-between;
          align-items: center;
          .price{
            margin-top: 5px;
            color: red;
            font-weight: bold;
            font-size: 14px;
          }
        }
        
      }
    }
  }
}


.bottom-button {
  background-color:#0C34BA;
  width: 100px;
  height: 40px;
}
</style>