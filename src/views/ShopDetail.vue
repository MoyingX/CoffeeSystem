<template>
    <!-- 商品详情页面 -->
    <div class="detail">
        <van-nav-bar
            title="商品详情"
            left-text="返回"
            right-text=""
            left-arrow
            @click-left="back"
        />
        <van-image :src="state.dtailData.large_img" style="width: 100%;"/>
        
        <div class="detailContent">

            <!-- 标题 -->
            <div class="title">
                <!-- 名字 -->
                <div class="name">
                    <span>{{state.dtailData.name}}</span><br>
                    <span class="en">{{state.dtailData.enname}}</span>
                </div>
                <!-- 价格 -->
                <div class="price">
                    <span>￥{{ state.dtailData.price }}</span>
                </div>
            </div>


            <!-- 选择 -->
            <div class="option" v-for="item in state.dtailData.rules" :key="item.name">
                <div class="optionLeft">
                    {{ item.name }}
                </div>
                <div class="optionRight" @click="item.activeIndex = i" :class="['rule-item',{ active: item.activeIndex === i}]" v-for="v,i in item.rule" :key="i">
                    {{ v.text }}
                </div>
            </div>

            <van-divider />

            <!-- 选择数量 -->
            <div class="number">
                <span style="font-size: 15px;">选择数量</span>
                <van-stepper v-model="state.count" theme="round" button-size="22" disable-input/>
            </div>

            <van-divider />

            <!-- 商品描述 -->
            <div class="desc">
                <span style="font-size: 15px;">商品描述</span>
                <p v-for="item,i in state.dtailData.desc" :key="i">
                    {{ i+1 }}、{{ item }}
                </p>
            </div>


            <!-- 垫脚石 -->
            <div style="height: 40px;"></div>
        </div>


        <!-- 底部购物车栏 -->
        <van-action-bar>
            <van-action-bar-icon icon="cart" text="购物车" :badge="state.shopcart_count" @click="router.push('/shopcar')" />
            <van-action-bar-icon :icon="state.isCollect?'like':'like-o'" 
                                 :color="state.isCollect?'red':''" 
                                 :text="state.isCollect?'已收藏':'收藏'"
                                 @click="collect"/>
            <van-action-bar-button color="rgb(12, 52, 186)" @click="useAddShopcart" type="warning" text="加入购物车" />
        </van-action-bar>
    </div>
</template>

<script setup>
import { ProductDetail,Like,NotLike,FindAllLike,AddShopcart,ShopcartCount } from '@/api/api'; 
import { useRoute,useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { onMounted,reactive } from 'vue';
import { showToast,showSuccessToast } from 'vant';
const router = useRouter()
const route = useRoute()
const store = useStore()

const state = reactive({
    dtailData:'',
    count:1,
    isCollect:false,
    shopcart_count:0,
})

//  返回按钮
const back = function(){
    router.back(-1)
}


/****************************************** */
//  是否收藏
const collect = function(){
    if(store.state.isLogin == 0) {
        showToast({
            message: '您还未登录',
            icon: 'warning-o',
        })
        return
    }
    if(state.isCollect == false){   //  点击收藏
        showToast({
            message: '已添加收藏',
            icon: 'like',
        })
        useCollect()
        state.isCollect = true
        return;
    }
    if(state.isCollect == true){    //  点击取消收藏
        showToast({
            message: '已取消收藏',
            icon: 'close',
        })
        notUseCollect()
        state.isCollect = false
        return;
    }
    
}

//  收藏功能
const useCollect = async() =>{
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await Like({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid:route.query.pid,
        tokenString: `${tokenString}`
    })
    console.log('收藏进后端数据了=>',data);
}

//  取消收藏功能
const notUseCollect = async() =>{
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await NotLike({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid:route.query.pid,
        tokenString: `${tokenString}`
    })
    console.log('取消收藏了=>',data);
}
/****************************************** */


//  加入购物车功能
const useAddShopcart = async () =>{
    if(store.state.isLogin == 0) {
        showToast({
            message: '您还未登录',
            icon: 'warning-o',
        })
        return
    }
    let rule = []
    state.dtailData.rules.forEach(v=>{
        rule.push(v.rule[v.activeIndex].text)
     
    })
    console.log(rule.join('/'));
    let tokenString = localStorage.getItem('tokenString')
    const {data} = await AddShopcart({
        pid:route.query.pid,
        count:state.count,
        rule:rule,
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        tokenString: `${tokenString}`
    })
    console.log(data);
    showSuccessToast('加入购物车成功')
    getShopcartCount()
}


//  获取详情数据
const getProductDetail = async() =>{
    const {data} = await ProductDetail({
        appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        pid:route.query.pid
    })
    let result = data.result[0];

    //  把描述转成数组
    result.desc = result.desc.split(/\n/);

    result.rules =[]
    result.count = 0
    //  定义需要处理的数据
    const rules = ['cream','milk','sugar','tem']
    rules.forEach(v=>{
        if (!result[v]) {
            return
        }
        //console.log(result.v);
        let rule = {
            name:result[v+'_desc'],
            activeIndex:0,
            rule:[]
        }
        result[v].split('/').forEach(i=>{
            let o = {
                text:i
            };
            rule.rule.push(o)
        });
        //  把规格添加进数组里面
        result.rules.push(rule)
    });
    state.dtailData = result;
    console.log('详情数据=>',state.dtailData);


    
}

//  用于收藏按钮的实时更新（通过个人用户收藏信息来验证是否该商品已被收藏）
const isCollectData = async()=>{
    if(localStorage.getItem('tokenString')){
        let tokenString = localStorage.getItem('tokenString')
        const {data} = await FindAllLike({
            appkey: 'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
            tokenString: `${tokenString}`
        })
        // console.log('当前页面的pid=>',route.query.pid);
        for(let i = 0 ; i<data.result.length;i++){
            // console.log('获取个人收藏数据的pid=>',data.result[i].pid);
            if (data.result[i].pid == route.query.pid) {
                state.isCollect = true;
            }
        }
    }
}

//  获取购物车内的商品数量
const getShopcartCount = async()=>{
  let tokenString = localStorage.getItem('tokenString')
  const {data} = await ShopcartCount({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    tokenString: `${tokenString}`
  })
  console.log(data);
  state.shopcart_count = data.result
  console.log(state.shopcart_count);
}

onMounted(()=>{
    getProductDetail()
    isCollectData()
    getShopcartCount()
})

</script>

<style lang="less" scoped>
.detail{
    background: #eee;
    .detailContent{
        background-color: #fff;
        padding: 10px 10px;
        width: 88%;
        margin: 5px auto;
        border-radius: 10px;
        // border: 1px solid black;
        .title{
            display: flex;
            text-align: left;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            .name{
                font-size: 16px;
            .en{
                font-size: 13px;
                color: gray;
            }
            }
            .price{
                font-weight: bold;
                font-size: 18px;
                color: red;
            }
        }
        
        .option{
            text-align: left;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 20px;
            height: 30px;
            .optionLeft{
                width: 60px;
                font-size: 16px;
            }
            .optionRight{
                width: 75px;
                font-size: 15px;
                border: 1px solid black;
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-radius: 20px;
                margin-right: 10px;
            }
            .rule-item{
                color: black;
            }
            .active{
                background-color: rgb(12, 52, 186);
                color: #fff;
            }
        }

        .number{
            display: flex;
            justify-content: space-between;
        }
        .desc{
            text-align: left;
            p{
                font-size: 13px;
            }
        }

    }
    

}
</style> 
