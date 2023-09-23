<template>
<!-- 新增地址页面 -->
  <div>
    <!-- 头部 -->
    <van-nav-bar
      title="新增地址"
      left-text="返回"
      left-arrow
      @click-left="router.back(-1)"
    />

    <!-- 主体 -->
    <van-form @submit="onSubmit" style="margin: 20px auto;">
      <van-cell-group inset>
        <!-- 姓名 -->
        <van-field
          v-model="name"
          name="name"
          label="姓名"
          placeholder="姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <!-- 电话 -->
        <van-field
          v-model="tel"
          name="tel"
          label="电话"
          type="number"
          placeholder="电话"
          :rules="[{ pattern, message: '请填写正确的电话' }]"
        />
        <!-- 地区 -->
        <van-field
          v-model="result"
          is-link
          readonly
          name="area"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <van-popup v-model:show="showArea" position="bottom">
          <van-area
            :area-list="areaList"
            @confirm="onConfirm"
            @cancel="showArea = false"
          />
        </van-popup>

        <!-- 详细地址 -->
        <van-field
          v-model="addressDetail"
          name="addressDetail"
          label="详细地址"
          placeholder="详细地址"
          :rules="[{ required: true, message: '请填写详细地址' }]"
        />

        <!-- 邮政编码 -->
        <van-field
          v-model="postalCode"
          name="postalCode"
          label="邮政编码"
          type="number"
          placeholder="邮政编码"
          maxlength="6"
          :rules="[{ required: true, message: '请填写邮政编码' }]"
        />
      </van-cell-group>

      <!-- 是否设为默认 -->
      <van-cell-group inset style="margin-top:20px;text-align: left;">
        <van-cell title="设为默认收获地址" >
        <template #right-icon>
          <van-switch v-model="checked" size="20px" @click="clickChecked"/>
        </template>
        </van-cell>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button color="#0C34BA"  round block type="primary" native-type="submit">
          保存
        </van-button>
      </div>

    </van-form>

    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { AddAddress } from '@/api/api';
import { onMounted, onBeforeUnmount,ref } from "vue";
import { areaList } from '@vant/area-data';
import { showSuccessToast } from 'vant';
const router = useRouter()

// 获取姓名
const name = ref('');
// 获取电话
const tel = ref('');
// 获取地址
const result = ref('');
// 省份
const province = ref('')
// 市
const city = ref('')
// 区县
const county = ref('')
// 获取详细地址
const addressDetail = ref('');
// 获取邮政编码
const postalCode = ref('');

//电话号码正则表达式
const pattern = /^[1][3,4,5,7,8][0-9]{9}$/;


// 控制地区栏的打开
const showArea = ref(false);
// 控制开关
const checked = ref(false);
const isDefault = ref('')
const clickChecked = ()=>{
  if(checked.value == false){
    isDefault.value = 0
  }else{
    isDefault.value = 1
  }
  console.log(isDefault.value);
}

//  提交信息处理
const onConfirm = ({ selectedOptions }) => {
  showArea.value = false;
  result.value = selectedOptions.map((item) => item.text).join('/');
};


//  提交按钮
const onSubmit = (values) => {
  console.log('submit', values);
  let areaArr = values.area.split('/')
  console.log(areaArr);
  province.value = areaArr[0]
  city.value = areaArr[1]
  county.value = areaArr[2]
  useAddAddress()
  showSuccessToast('保存地址成功');
  setTimeout(()=>{
    router.back(-1)
  },500)
};



//  提交地址功能
const useAddAddress = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await AddAddress({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
    name:name.value,
    tel:tel.value,
    province:province.value,
    city:city.value,
    county:county.value,
    addressDetail:addressDetail.value,
    areaCode:postalCode.value,
    postalCode:postalCode.value,
    isDefault:isDefault.value
  })
  console.log(data);
}


onMounted(()=>{
  if(checked.value == false){
      isDefault.value = 0
  }else{
      isDefault.value = 1
  }
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})
</script>

<style lang="less" scoped>

</style>