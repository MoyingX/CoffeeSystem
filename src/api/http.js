import axios from "axios";
// 重置axios
const http = axios.create({
    // 默认的请求地址
    baseURL: 'http://www.kangliuyong.com:10002',
    // 请求的事件超过设置的事件就会报错
    // timeout: 2000,
    // 请求头
  });



  // 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let paramsString = '';
    for(let key in config.data){
      console.log(key);
      paramsString += `${key}=${config.data[key]}&`
    }
    config.data = paramsString.slice(0,-1);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });



// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });




function request ({url,method,data,params}){
    return http({url,method,data,params})
}
  export default request;