// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//引用路由
import VueRouter from "vue-router"
//引入公共路由通道
import { routes } from "./router/routes"
//使用axios进行http请求
import axios from "axios"

//引入store
import store from "./vuex/store"



//使用路由
Vue.use(VueRouter)

//使用Axios
Vue.prototype.$axios = axios

//axios.defaults.baseURL = 'http://127.0.0.1:8888/gun';
//axios.defaults.baseURL = 'http://132.232.32.227:8888/gun';
axios.defaults.baseURL = 'http://120.76.156.120:8888/gun';
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF- 8';// 配置请求头
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true; // 让ajax携带cookie


// http request 请求拦截器，有token值则配置上token值
axios.interceptors.request.use(
  config => {
   /*  if (token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      alert(123);
      config.headers.Authorization = token;
    } */
    return config;
  },
  err => {
    layer.msg("请求超时!")
    return Promise.reject(err);
  });
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    //alert(error)
    if (error =="Error: Network Error"){
      layer.msg("服务器被吃了⊙﹏⊙∥");
      next("/login")
    } 
    if (error.response) {
      switch (error.response.status) {
        case 404:
          // 这里写清除token的代码
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }//登录成功后跳入浏览的当前页面
          });
        case 504:
          layer.msg("服务器被吃了⊙﹏⊙∥");
        case 403:
          layer.msg("权限不足,请联系管理员!");
         default:
          layer.msg("未知错误!"); 
      }
    }
    return Promise.reject(error.response)
  });






//配置路由、
const router = new VueRouter({
  routes,
  mode: "history",
  scrollBehavior(to, from, savedPosition) {//路由控制滚动行为
    //return {x:0,y:100}
    //return {selector:'.btn'}
    //回到浏览器上次页面的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },

})



//全局守卫
/**
 * == 1、全局守卫 ==
 * 回调函数
 * to:你要弄进入到哪一个路由中
 * from:你从哪一个路由离开  
 * next：对应的函数
 */
  router.beforeEach((to, from, next) => {
  //next("/login");
    //console.log(to)
    //alert(store.state.userState)
  //判断store.gettes.isLogin===fasle
  if (to.path == '/login'){
    next();//会正常访问，加false就不会访问
  } else if (store.state.userState=="true"){
    next(true);
  }else{
    next("/login");
    alert("请先登录！");
  }
})  

/* eslint-disable no-new */
new Vue({//进行渲染，挂载
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
