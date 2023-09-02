<template>
<!-- 我的地址管理页面 -->
  <div>
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="back"
    />
    这是我的地址管理页面
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()
const back = () =>{
  router.back(-1)
}
</script>

<style>

</style>