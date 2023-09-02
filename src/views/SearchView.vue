<template>
  <!-- 搜索页面 -->
  <div class="search">

    <!-- 搜索框 -->
    <div class="title">
        <van-icon name="arrow-left" size="30" @click="router.back(-1)"/>
        <van-search v-model="state.searchValue" 
                    shape="round" 
                    show-action
                    placeholder="请输入搜索关键词" 
                    @search="onSearch"
                    @cancel="router.back(-1)"
                    @click="onClickSearch"
                    style="width: 90%;"
        />
    </div>

    <!-- 历史记录 -->
    <div class="searchHistory">
      <div class="notHistory" v-show="state.historyList == ''">暂无搜索记录</div>
      <div class="historyList">
        <div class="haveHistory" v-for="(item,index) in state.historyList" :key="index">
          <span style="margin-right: 5px;" @click="clickHistory(item)">{{ item }}</span>
          <van-icon name="cross" @click="deteleHistory(item)"/>
        </div>
      </div>
      <!-- 清除历史记录按钮 -->
      <div class="clearHistory">
        <div class="clearBtn" @click="clearHistory">清除所有搜索历史</div>
      </div>
    </div>

    <!-- 搜索提示 -->
    <div class="prompt" v-show="!state.prompt==''">
      您搜索的<span>{{ state.prompt }}</span>结果如下：
    </div>

    <!-- 搜索列表 -->
    <div class="searchList">
      <div class="card" v-for="item in state.searchList" :key="item.pid" @click="router.push('/detail?pid='+item.pid)">
        <img :src="item.smallImg" alt="">
        <div style="width: 89%; margin: 0 auto;">
          <div class="name">{{ item.name }}</div>
          <div class="enname">{{ item.enname }}</div>
          <div class="price">￥{{ item.price }}</div>
        </div>
      </div>
      <van-empty v-if="state.searchList==''" class="nocard" :image-size="200" description="暂无搜索结果" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive,onBeforeUnmount } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Search } from '@/api/api'
import { showConfirmDialog,showFailToast } from 'vant';
const router = useRouter()
const store = useStore()

//数据
const state = reactive({
    searchValue:'',
    historyList:[],

    
    prompt:'',  //用于搜索提示
    searchList:'',
})



// 点击输入框清空输入内容
const onClickSearch =()=>{
  state.searchValue = ''
}

// 回车搜索
const onSearch = (val) => {
  if(state.searchValue == '') {
    showFailToast('搜索不得为空');
    return console.log('搜索不得为空');
  }
  state.searchValue = val
  state.prompt = val
  getSearch()
  store.commit('searchHistory',val)
  getHistoryList()
  console.log('历史记录=>',state.historyList);
};

// 点击单个历史搜索
const clickHistory = (item) =>{
  console.log(item);
  state.searchValue = item
  state.prompt = item
  getSearch()
  getHistoryList()
}


//  点击删除单个历史搜索
const deteleHistory = (item) =>{
  store.commit('deleteHistory',item)
  getHistoryList()
}

//  点击清除所有历史记录
const clearHistory =()=>{
  showConfirmDialog({
    title: '是否清除所有搜索记录？',
  })
    .then(() => {
      store.state.searchHistoryList =[]
      state.searchList='',
      state.searchValue = '',
      getHistoryList()
    })
    .catch(() => {
      // on cancel
    });
  
}





// 获取搜索记录
const getHistoryList=()=>{
  state.historyList = store.state.searchHistoryList
}

// 获取搜索结果
const getSearch = async()=>{
  const {data} = await Search({
    appkey:'U2FsdGVkx19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
    name: `${state.searchValue}`
  })
  state.searchList = data.result
  console.log('搜索结果=>',state.searchList);
}


onMounted(()=>{
  getHistoryList()
  document.body.setAttribute('style', 'background:#eee')
})
onBeforeUnmount(()=>{
  document.body.removeAttribute('style')
})
</script>

<style lang="less" scoped>
.search{
  background: #eee;
  text-align: left;
  .title{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }

  .searchHistory{
    .notHistory{
      background-color: #fff;
      height: 30px;
      line-height: 35px;
      text-align: center;
      color: rgb(200, 200, 200);
    }
    .historyList{
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      padding-left: 10px;
      padding-right: 10px;
      .haveHistory{
        margin-left: 10px;
        margin-bottom: 10px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 13px;
        line-height: 20px;
        height: 20px;
        background-color: rgb(227, 227, 227);
      }
    }


    .clearHistory{
      padding-top: 20px;
      background-color: #fff;
      height: 50px;
      .clearBtn{
        margin: 0 auto;
        height: 30px;
        width: 200px;
        border-radius: 30px;
        line-height: 30px;
        text-align: center;
        background-color: rgb(228, 228, 228);
        font-size: 15px;
      }
    }
    
  }

  .prompt{
    padding-top: 5px;
    padding-left: 10px;
    font-size: 16px;
    span{
      margin-left: 3px;
      margin-right: 3px;
      font-weight: bold;
      color: red;
    }
  }

  .searchList{
    padding: 10px 10px 0px 10px;
    display: flex;
    background-color: #eee;
    justify-content: space-between;
    flex-wrap: wrap;
    .card{
      background-color: #fff;
      width: 175px;
      height: 240px;
      margin-bottom: 10px;
      img{
        display: block;
        width: 155px;
        height: 155px;
        margin: 10px auto;
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
      .price{
        margin-top: 5px;
        color: red;
        font-weight: bold;
        font-size: 14px;
      }

    }
    .nocard{
      margin: 0 auto;
      height: 250px;
    }
  }
}
</style>