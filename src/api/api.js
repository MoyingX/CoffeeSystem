// 存放接口的文件

// 引入配置的文件
import request from "./http";

//  get请求用的是params   post请求用的是data


// 请求轮播图 
export const Register =  (data)  => request({
    url:'/register',
    method:'post',
    data
});

//  请求登录数据
export const Login =  (data)  => request({
    url:'/login',
    method:'post',
    data
});

//  请求轮播图数据
export const Banner =  (params)  => request({
    url:'/banner',
    method:'get',
    params
});

//  根据商品类型获取商品接口
export const TypeProducts =  (params)  => request({
    url:'/typeProducts',
    method:'get',
    params
});


//  查看商品详情
export const ProductDetail =  (params)  => request({
    url:'/productDetail',
    method:'get',
    params
});

//  获取商品类型
export const Type = (params) =>request({
    url:'/type',
    method:'get',
    params
})

//  获取个人资料
export const FindAccountInfo = (params) => request({
    url:'/findAccountInfo',
    method:'get',
    params
})


//  获取个人信息
export const FindMy = (params) =>request({
    url:'/findMy',
    method:'get',
    params
})


//  修改个人昵称
export const UpdateNickName = (data) =>request({
    url:'/updateNickName',
    method:'post',
    data
})

//  修改个人简介
export const UpdateDesc = (data) =>request({
    url:'/updateDesc',
    method:'post',
    data
})


//  收藏商品接口
export const Like = (data) =>request({
    url:'/like',
    method:'post',
    data
})

//  取消收藏商品接口
export const NotLike = (data) =>request({
    url:'/notlike',
    method:'post',
    data
})

//  查询用户收藏商品接口
export const FindAllLike = (params) =>request({
    url:'/findAllLike',
    method:'get',
    params
})

//  搜索商品接口
export const Search = (params) =>request({
    url:'/search',
    method:'get',
    params
})


//  添加购物车商品接口
export const AddShopcart = (data) =>request({
    url:'/addShopcart',
    method:'post',
    data
})

//  查询用户所有购物车条数接口
export const FindAllShopcart = (params) =>request({
    url:'/findAllShopcart',
    method:'get',
    params
})

//  查询购物车商品总数量接口
export const ShopcartCount = (params) =>request({
    url:'/shopcartCount',
    method:'get',
    params
})

//  修改购物车商品数量接口
export const ModifyShopcartCount = (data) =>request({
    url:'/modifyShopcartCount',
    method:'post',
    data
})

//  删除 一个或者多个 购物车商品接口 
export const RemoveShopcart = (data) =>request({
    url:'/removeShopcart',
    method:'post',
    data
})

//  提交订单页面查询需要购买商品接口
export const CommitShopcart = (params) =>request({
    url:'/commitShopcart',
    method:'get',
    params
})

//  立即结算接口
export const Pay = (data) =>request({
    url:'/pay',
    method:'post',
    data
})

//  查询订单接口
export const FindOrder = (params) =>request({
    url:'/findOrder',
    method:'get',
    params
})

// 确认收货接口
export const Receive = (data) =>request({
    url:'/receive',
    method:'post',
    data
})

//  删除订单接口
export const RemoveOrder = (data) =>request({
    url:'/removeOrder',
    method:'post',
    data
})

//  上传头像接口
export const UpdateAvatar = (data) =>request({
    url:'/updateAvatar',
    method:'post',
    data
})

export const DestroyAccount = (data) =>request({
    url:'/destroyAccount',
    method:'post',
    data
})

//  退出登录接口(用不到此接口，我直接removelocalStorage)
// export const Logout = (data) =>request({
//     url:'/logout',
//     method:'post',
//     data
// })