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
//对状态进行管理
import vuex from 'vuex'


//状态存储是响应式
Vue.use(vuex)
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
