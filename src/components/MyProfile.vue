<template>
<!-- 个人资料页面 -->
  <div class="myProfile">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="router.back(-1)"
    />
    <div class="bg"></div>

    
    <!-- 卡片 -->
    <van-cell-group inset class="card" v-for="item in state.userInfo" :key="item.userId">
      <van-cell center  title="头像" :image="item.userImg" class="userImg">
        <template #value>
          <img src="../assets/images/橘猫.jpg" alt="" style="width: 50px;border-radius: 50%;" @click="showImg = true">
          <!-- <img :src="item.userImg" alt="" style="width: 50px;border-radius: 50%;" @click="showImg = true"> -->
          <van-overlay :show="showImg" @click="showImg = false" >
            <div class="overlay">
              <img src="../assets/images/橘猫.jpg" class="bigImg" alt="">
              <img :src="item.userImg" class="bigImg" alt="">
              <div class="changeImg">
                <van-uploader :after-read="afterRead">
                  <van-button icon="plus" color="#fff" style="background-color: rgba(0, 0, 0, 0);" plain type="primary">更换头像</van-button>
                </van-uploader>
              </div>
            </div>
          </van-overlay>
        </template>
      </van-cell>
      <van-cell title="用户id" :value="item.userId" />
      <van-cell title="手机号" :value="item.phone" />
      <van-cell title="昵称" :value="state.nickNameValue||item.nickName" @click="clickCellNickName"/>
      <van-cell title="简介" :label="state.descValue||item.desc" @click="clickCellDesc"/>
    </van-cell-group>


    <!-- 修改昵称弹窗 -->
    <van-dialog v-model:show="state.showNickname" title="修改昵称" show-cancel-button :beforeClose="isUpdateNickName">
      <van-field v-model="state.nickNameValue" input-align="center" placeholder="请修改您的昵称" />
    </van-dialog>

    <!-- 修改简介弹窗 -->
    <van-dialog v-model:show="state.showDesc" title="修改简介" show-cancel-button :beforeClose="isUpdateDesc">
      <van-field v-model="state.descValue" 
      placeholder="请修改您的简介（最多20字）" 
      autosize 
      show-word-limit 
      rows="3"
      size='large'
      type="textarea"
      maxlength="20"/>
    </van-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive,ref } from 'vue'
import { useRouter } from 'vue-router'
import { UpdateNickName,FindAccountInfo,UpdateDesc,UpdateAvatar } from '@/api/api';
import { showSuccessToast,showFailToast } from 'vant';
const router = useRouter()
const showImg = ref(false);

const state = reactive({
  //  修改昵称弹窗状态
  showNickname:false,
  showDesc:false,
  showImg:false,

  nickNameValue:'',
  descValue:'',

  //  个人信息
  userInfo:'',

  //  头像base64码
  ImgBase64:'',
  //  头像格式
  ImgType:''
})

//  上传文件信息
const afterRead = (file) => {
  // 此时可以自行将文件上传至服务器
  console.log(file);
  state.ImgBase64 = file.content
  state.ImgType = file.type
  // console.log(state.ImgBase64);
  useUpdateAvatar()
  getFindAccountInfo()
};


//  点击卡片单元格修改昵称
const clickCellNickName =()=>{
  state.showNickname = true
}
//  点击卡片单元格修改简介
const clickCellDesc =()=>{
  state.showDesc = true
}


//  点击弹出框确认修改昵称
const isUpdateNickName = (action)=>{
  if(action === 'confirm'){   //确认按钮
    if(state.nickNameValue == '')
      {
        return showFailToast('昵称不得为空');
      }
    useUpdateNickName()
    showSuccessToast('修改昵称成功')
    state.showNickname = false

  }else{                      //取消按钮
    state.showNickname = false
  }
}

//  点击弹出框确认修改简介
const isUpdateDesc = (action)=>{
  if(action === 'confirm'){   //确认按钮
    if(state.descValue == '')
      {
        return showFailToast('简介不得为空');
      }
    useUpdateDesc()
    showSuccessToast('修改简介成功')
    state.showDesc = false

  }else{                      //取消按钮
    state.showDesc = false
  }
}




//  修改昵称功能
const useUpdateNickName = async() =>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await UpdateNickName({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString:`${tokenString}`,
    nickName: `${state.nickNameValue}`
  })
  console.log(data);
}


//  修改简介功能
const useUpdateDesc = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await UpdateDesc({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    desc: `${state.descValue}`
  })
  console.log(data);
}

//  修改头像功能
const useUpdateAvatar = async(file)=>{

  let tokenString = localStorage.getItem('tokenString')
  const {data} = await UpdateAvatar({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    imgType:'jpeg',
    serverBase64Img:`${state.ImgBase64}`
  })
  console.log(data);
}


//  获取个人资料
const getFindAccountInfo = async() =>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindAccountInfo({
    appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
  })
  state.userInfo = data.result

  console.log(state.userInfo);
}

onMounted(()=>{
  getFindAccountInfo()

})
</script>


<style lang="less" scoped>
.myProfile{
  background: #eee;
  height: 100vh;
  text-align: left;
  .bg{
    width: 100%;
    height: 100px;
    background-color: #0C34BA;
  }
  .card{
    width: 95%;
    margin: -25px auto;
    position: relative;
    background-color: #fff;
    border-radius: 15px 15px 0 0;
    padding-top: 15px;
    .overlay{
      width: 90%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      .bigImg{
        width: 100%;
        border-radius: 0px;
      }
      .changeImg{
        margin-top: 20px;
      }
    }
    
  }
}
</style>