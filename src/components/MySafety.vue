<template>
<!-- 我的安全中心页面 -->
  <div class="mySafety">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    <div class="bg"></div>
    <van-cell-group inset style=" width: 90%;;margin: -20px auto;padding: 5px 5px 5px 5px;">
      <van-cell style="height: 50px;" center  title="修改密码" is-link  />
      <van-cell style="height: 50px;" center  title="注销账号" is-link  @click="clickDestroyAccount"/>
    </van-cell-group>
    
    <div style="width:95%;margin: 100px auto;" >
      <van-button style="width: 100%;" round color="#0C34BA" @click="clickBtn">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted,onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DestroyAccount } from '@/api/api';
import { showConfirmDialog,showSuccessToast } from 'vant';
const store = useStore()
const router = useRouter()
const back = () =>{
  router.back(-1)
}

//  点击按钮 退出登录功能
const clickBtn=()=>{
  showConfirmDialog({
    title: '退出登录',
    message:'是否退出登录？'
  })
    .then(() => {
      localStorage.removeItem('tokenString');
      store.commit('useLogin',0)
      showSuccessToast('您已退出登录');
      router.push('/my')
    })
    .catch(() => {
      // on cancel
    });
}

//  点击按钮注销账号
const clickDestroyAccount = ()=>{
  showConfirmDialog({
    title: '注销账号',
    message:'是否注销账号？'
  })
    .then(() => {
      setTimeout(()=>{
        showConfirmDialog({
        title: '确认注销账号',
        message:'注销账号后无法找回'
      })
        .then(() => {
          // useDestroyAccount()
          showSuccessToast(`您已成功注销账号`);
          router.push('/my')
        })
        .catch(() => {
          showSuccessToast('您已取消注销账号');
        });
      },100)
    })
    .catch(() => {
      // on cancel
    });
}


//  注销账号功能
const useDestroyAccount = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await DestroyAccount({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`
  })
}

onMounted(() => {
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})


</script>

<style lang="less" scoped>
.mySafety{
  text-align: left;
  .bg{
    width: 100%;
    height: 120px;
    background-color: #0C34BA;
  }
}
</style>