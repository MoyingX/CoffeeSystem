<template>
  <div class="menu">
    <!-- 搜索框 -->
    <van-search style="position: sticky;top:0px;z-index: 100;" 
                v-model="state.searchValue" 
                shape="round" 
                placeholder="请输入搜索关键词" 
                @click="search"
    />

    <div class="content">
      <!-- 侧边导航栏 -->
      <van-sidebar v-model="state.active" @change="onChange" >
        
        <van-sidebar-item v-for="item in state.title" :key="item.id" :title="item.typeDesc" @click="typeName(item.type,item.id)"/>
      </van-sidebar>

      <!-- 分类后的商品 -->
      <div class="contentRight">
        <div v-if="!state.TypeProductData">
          <van-loading type="spinner" />
        </div>
        <div v-else>
          <!-- 商品内容 -->
          <div v-if="state.id" class="Right">
            <div class="coffee" v-for="item in state.TypeProductData" :key="item.id" @click="router.push('/detail?pid='+item.pid)">
                <img :src="item.smallImg" style="width: 125px;height: 125px;" alt="">
                <div v-if="item.isHot" class="hot">热卖</div>
              
              <br>
              <span class="name">{{ item.name }}</span><br>
              <span class="enname">{{ item.enname }}</span>
              <span class="price">￥{{ item.price }}</span>
            </div>
          </div>
        </div>
        <!-- 垫脚石 -->
        <div style="height: 50px;"></div>
      </div>

      
    </div>  

    
  </div>
</template>

<script setup>
import { Type,TypeProducts } from '@/api/api';
import { onMounted, reactive} from "vue";
import { useRouter } from 'vue-router';

  //  数据
  const state = reactive({
    searchValue:'',
    active:0,
    title:null,
    index:0,
    id:1,
    TypeProductData:null,
    type:[],
    typeName:'coffee',
  })



  //  监听切换侧边导航栏
  const onChange = (index) => {
    state.index = index
  };

  //  切换导航栏重新获取分类后的商品数据
  const typeName = (typeName,id) => {
    // console.log('type=>',state.type);
    state.typeName = state.type[id-1]
    state.id = id
    console.log(state.typeName);
    getTypeProducts();
  }


  //  获取分类数据
  const getType = async()=>{
    const {data} = await Type({
      appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='
    });

    //  获取title的名字
    state.title = data.result
    console.log('title的名字=>',state.title);

    //  获取type
    for (let i = 0; i < 4 ; i++) {
      var type = data.result[i].type
      state.type.push(type)
    }
    // console.log('获取到的type=>',state.type);
  }


  //  获取分类后的商品数据
  const getTypeProducts = async() =>{
    const {data} = await TypeProducts({
      appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
      key: 'type',
      value: state.typeName,
    })
    
    state.TypeProductData = data.result
    console.log('分类后的商品数据=>',state.TypeProductData);
  }


  //  点击搜索
  const router = useRouter()
  const search = () =>{
    router.push('/search')
  }

  onMounted(()=>{
    getType();
    getTypeProducts();
  })
</script>

<style lang="less" scoped>
.van-sidebar{
  width: 100px;
  height: 90vh;
  background-color: rgb(247, 248, 250);
  position:fixed;	
}
.van-sidebar-item{
  width:100px
}

.menu{
  .content{
    display: flex;
    
      .contentRight{
        margin-left: 100px;
        width: 72%;
          .Right{
            margin-left: 8px;
            // border: 1px solid black;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .coffee{
              width: 125px;
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
                font-size: 15px;
              }
              .enname{
                font-size: 10px;
                display: block;
                color: gray;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

              }
              .price{
                color: red;
                font-weight: bold;
                font-size: 14px;
              }
            }
          }
        
    }
  }
}
</style>