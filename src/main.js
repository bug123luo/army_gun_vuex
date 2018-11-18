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

axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.timeout = 10000;



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
    //console.log(to);
  //判断store.gettes.isLogin===fasle
  if (to.path == '/login'){
    next();//会正常访问，加false就不会访问
  } else{
    if (store.state.userState===true){
      next(true);
    }else{
      next("/login");
      alert("请先登录！");
    }
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
