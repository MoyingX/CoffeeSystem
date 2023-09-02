import { createStore } from 'vuex'



const store =  createStore({
    state:{
        searchHistoryList:[],
        sids:[],
        isLogin:0   //0表示未登录，1表示登录
    },
    mutations:{
        //  添加历史记录列表
        searchHistory(state,playload){
            state.searchHistoryList.unshift(playload)
            
            //  数组查重
            state.searchHistoryList = state.searchHistoryList.filter((item,index)=>{
                return state.searchHistoryList.indexOf(item) === index
            })
        },
        //  删除单个搜索记录
        deleteHistory(state,playload){
            var new_set = new Set(state.searchHistoryList)
            new_set.delete(playload)
            state.searchHistoryList = [...new_set]
        },

        //  提交上去的订单sids
        addsids(state,playload){
            state.sids = playload
        },


        //  控制登录状态
        useLogin(state,playload){
            state.isLogin = playload
        }
    },
    actions:{

    }
})

export default store