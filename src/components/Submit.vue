<template>
<!-- 订单结算界面 -->
  <div class="sumbit">
    <!-- 头部 -->
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      right-text=""
      left-arrow
      @click-left="router.back(-1)"
    />

    <!-- 地址信息 -->
    <div class="addressInfo">
        <div class="addressInfoHeader" @click="showPopup">选择地址<van-icon name="arrow" /></div>
        <div class="address">
            <div class="userAddress">
                <span style="font-weight: bold;">{{state.selectAddress.name}}</span>&emsp;
                <span>{{state.selectAddress.tel}}</span>&emsp;
                <span v-if="state.selectAddress.isDefault == 1" class="default">默认</span>
            </div>
            <div class="detailsAddress">
                {{state.selectAddress.address}}
            </div>
        </div>
    </div>

    <!-- 订单信息 -->
    <div class="orderInfo">
        <div class="title">订单信息</div>
        <div class="card" v-for="item in state.orderList" :key="item.pid">
            <img :src="item.small_img" style="width: 80px;" alt="">
            <div style="margin-left: 10px;">
                <div class="name">{{ item.name }}&emsp;&emsp;&emsp;<span style="color: gray;">{{ item.rule }}</span></div>
                <div class="enname">{{ item.enname }}</div>
                <div class="footer">
                    <div class="price">￥{{ item.price }}</div>
                    <div class="count">x{{ item.count }}</div>
                </div>
            </div>
        </div>
        <van-divider dashed
        :style="{ color: '#1989fa', borderColor: 'rgb(128,128,128)', padding: '0 16px' }"
        >
        </van-divider>
        <div class="orderFooter">
            <div>共计 {{allCount}} 件商品</div>
            <div style="color: red;font-weight: bold;">订单金额：￥{{allPrice.toFixed(2)}}</div>
        </div>
    </div>

    <!-- 结算按钮 -->
    <div style="width: 94%; margin: 0 auto;">
        <van-button style="width: 100%;" color="#0C34BA" round type="success" @click="clickPay">立即结算</van-button>
    </div>

    
    <!-- 选择地址弹出框 -->
    <van-popup
        v-model:show="show"
        closeable
        position="bottom"
        :style="{ height: '45%' }"
        
    >
        <div class="popup">
            <div class="popupTitle">选择地址</div>
            <van-radio-group v-model="checked" style="height: 200px;overflow: auto;">
                <van-cell-group inset>
                    <van-cell clickable v-for="(item,index) in state.addressList" :key="item.aid" 
                    @click="checked = (index+1);
                    console.log('已选择的地址=>',item); 
                    unShowPopup();
                    state.selectAddress.name = item.name;
                    state.selectAddress.tel = item.tel
                    state.selectAddress.address = item.province+item.city+item.county+item.addressDetail
                    state.selectAddress.isDefault = item.isDefault
                    ">
                        <template #right-icon>
                            <van-radio :name=(index+1) checked-color="#0C34BA">
                                <div class="popupCard">
                                    <div class="popupCardTitle">
                                        <div>{{item.name}}&emsp;{{item.tel}}&emsp;<span class="default" v-if="item.isDefault == 1">默认</span></div>
                                    </div>
                                    <div class="popupCardFooter">
                                        <span>{{item.province}}{{item.city}}{{item.county}}{{item.addressDetail}}</span>
                                    </div>
                                </div>
                            </van-radio>
                        </template>
                    </van-cell>

                </van-cell-group>
            </van-radio-group>
            <div style="width: 94%; margin: 0 auto;">
                <van-button style="width: 100%;" 
                            color="#0C34BA"
                            round type="success"
                            @click="router.push('/my/addAddress')">新增地址</van-button>
            </div>
        </div>
    </van-popup>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { CommitShopcart,Pay,FindAddress } from '@/api/api'
import { onMounted,onBeforeUnmount, reactive, computed,ref  } from "vue";
import { useStore } from "vuex";
import { showSuccessToast, showConfirmDialog,showToast } from 'vant';
const router = useRouter()
const store = useStore()

const checked = ref('1');

const show = ref(false);
const showPopup = () => {
    show.value = true;
};
const unShowPopup = () => {
    setTimeout(()=>{
        show.value = false;
    },300)
};

const state = reactive({
    //  订单信息
    orderList:'',
    //  保存地址信息
    addressList:'',
    //  保存选择后的单个地址信息
    selectAddress:{
        name:'',
        tel:'',
        address:'',
        isDefault:0,
    }
})

//  计算商品总数量
const allCount = computed(()=>{
    let count = 0
    for(let i=0;i<state.orderList.length;i++){
        count = state.orderList[i].count + count
    }
    return count;
})

//  计算商品总价格
const allPrice = computed(()=>{
    let allPrice = 0
    for(let i=0;i<state.orderList.length;i++){
        let price = (state.orderList[i].price) * (state.orderList[i].count)
        allPrice = allPrice + price
    }
    return allPrice;
})


//  点击'立即结算按钮'提交
const clickPay = ()=>{
    showConfirmDialog({
        title: '确认结算？',
    })
    .then(() => {
        usePay()
        showSuccessToast('结算成功');
        router.push('/my/myOrder')
    })
    .catch(() => {
        // on cancel
    });
}

//  进入结算后的设置默认地址显示
const DefaultAddress = ()=>{
    setTimeout(()=>{
        //  筛选出默认地址
        for(let i=0;i<state.addressList.length;i++){
            if(state.addressList[i].isDefault == 1){
                console.log('默认地址=>',state.addressList[i]);
                state.selectAddress.name = state.addressList[i].name
                state.selectAddress.tel = state.addressList[i].tel
                state.selectAddress.address = state.addressList[i].province + state.addressList[i].city + state.addressList[i].county + state.addressList[i].addressDetail
                state.selectAddress.isDefault = state.addressList[i].isDefault
            }
        }
    },600)

}

//  获取订单信息
const getCommitShopcart = async()=>{
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await CommitShopcart({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: `${tokenString}`,
        sids:JSON.stringify(store.state.sids)
        // sids:JSON.stringify(['_s1692025856059','_s1692025849474','_s1692019726232'])
    })
    state.orderList = data.result
    console.log('订单信息=>',state.orderList);
}

//  立即结算功能按钮
const usePay = async()=>{
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await Pay({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: `${tokenString}`,
        sids:JSON.stringify(store.state.sids),
        // sids:JSON.stringify(['_s1692025856059','_s1692025849474','_s1692019726232']),
        phone:state.selectAddress.tel,
        address:state.selectAddress.address,
        receiver:state.selectAddress.name
    })
    console.log(data);
}

//  获取全部地址管理数据
const getFindAddress = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await FindAddress({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`,
  })
  console.log('地址数据=>',data.result);
  state.addressList = data.result
}

onMounted(()=>{
    getCommitShopcart()
    getFindAddress()
    DefaultAddress()
    document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})

</script>

<style lang="less" scoped>
.sumbit{
    width: 100%;
    text-align: left;
    .addressInfo{
        width: 95%;
        height: 100px;
        border-radius: 10px 10px 0 0;
        margin: 10px auto;
        background-color: #fff;
        .addressInfoHeader{
            width: 20%;
            margin-left: 10px;
            // background-color:yellow;
            line-height: 40px;
            height: 40px;
            font-size: 14px;
            font-weight: bold;
        }
        .address{
            margin-left: 10px;
            .userAddress{
                margin-bottom: 10px;
                font-size: 15px;
                .default{
                    background-color: #0C34BA;
                    color: #fff;
                    border-radius: 20px;
                    padding: 0 5px 0 5px;
                    font-size: 13px;
                }
            }
            .detailsAddress{
                font-size: 14px;
                color: darkgray;
            }
        }
    }
    .orderInfo{
        margin: 30px auto;
        background-color: #fff;
        width: 95%;
        border-radius: 10px 10px;
        .title{
            margin: 0 0 0 15px;
            line-height: 60px;
            font-weight: bold;
            font-size: 15px;
        }
        .card{
            margin-left: 15px;
            margin-bottom: 10px;
            display: flex;
            .name{
                font-size: 14px;
            }
            .enname{
                font-size: 10px;
                width: 225px;
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
                    margin-top: 20px;
                    color: red;
                    font-weight: bold;
                    font-size: 14px;
                }
                .count{
                    margin-top: 20px;
                    font-size: 14px;
                }
            }
        }
        .orderFooter{
            display: flex;
            justify-content: space-between;
            margin:0 10px 0 10px;
            padding-bottom: 20px;
            font-size: 14px;
        }
    }
    .popup{
        width: 100%; 
        margin: 0 auto;
        .popupTitle{
            height: 50px;
            margin-left: 10px;
            line-height: 50px;
            // background-color: yellow;
            font-size: 16px;
            font-weight: bold;
        }
        .popupCard{
            margin-left: 15px;
            .popupCardTitle{
                .default{
                    background-color: #0C34BA;
                    color: #fff;
                    border-radius: 20px;
                    padding: 0 5px 0 5px;
                    font-size: 13px;
                }
            }
            
        }
    }
}
</style>