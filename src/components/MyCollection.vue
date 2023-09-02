<template>
<!-- 我的收藏页面 -->
  <div class="myCollection">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="bg"></div>
    <div class="cardList">
      <van-empty v-show="state.collectionList == ''" description="没有收藏数据！" style="margin: 0 auto;"/>
      <div class="card" v-for="item in state.collectionList" :key="item.id" @click="router.push('/detail?pid='+item.pid)">
        <img :src="item.smallImg" style="width: 165;height: 165px;" alt="">
        <div v-if="item.isHot" class="hot">热卖</div>
        <div class="name">
          {{ item.name }}
        </div>
        <div class="enname">
          {{ item.enname }}
        </div>
        <div class="footer">
          <div class="price">
          ￥{{ item.price }}
          </div>
          <van-icon name="delete-o" size="20" color="darkgray" @click="clickTrash(item.pid) "/>
        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { FindAllLike,NotLike } from '@/api/api'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant';
const router = useRouter()

const state = reactive({
  collectionList:''
})

const back = () =>{
  router.back(-1)
}


//  获取用户收藏商品数据
const getFindAllLike = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindAllLike({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`
  })
  state.collectionList = data.result
  console.log(state.collectionList);

}

//  点击垃圾桶
const clickTrash = (pid)=>{
  showConfirmDialog({
    title: '是否删除收藏？',
  })
    .then(() => {
      notUseCollect(pid)  
      setTimeout(()=>{
        getFindAllLike()
      },50)
    })
    .catch(() => {
      // on cancel
    });
}

//  取消收藏功能
const notUseCollect = async(pid) =>{
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await NotLike({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid:pid,
        tokenString: `${tokenString}`
    })
    console.log('取消收藏了=>',data);
}


onMounted(()=>{
  getFindAllLike()
})

</script>

<style lang="less" scoped>
.myCollection{
  background: #eee;
  text-align: left;
  .bg{
    width: 100%;
    height: 100px;
    background-color: #0C34BA;
  }
  .cardList{
    width: 90%;
    padding: 0 10px 0 10px;
    margin: -25px auto;
    background-color: #fff;
    position: relative;
    border-radius: 15px 15px 15px 15px;
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .card{
      width: 165px;
      text-align: left;
      margin-bottom: 10px;
      position: relative;
      .hot{
        position: absolute;
        left: 0;
        top: 0;
        background-color:red;
        color: #fff;
        font-size: 10px;
        padding-left: 4px;
        width: 30px;
        border-radius: 0px 15px 15px 0px;
      }
      .name{
        margin-top: 7px;
        font-size: 15px;
      }
      .enname{
        font-size: 10px;
        color: gray;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

      }
      .footer{
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        .price{
          color: red;
          font-weight: bold;
          font-size: 14px;
        }
      }
    }
  }
}
</style>