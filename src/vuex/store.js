//定义全局变量

//对状态进行管理
import Vue from 'vue'
import Vuex from 'vuex'


//状态存储是响应式
Vue.use(Vuex)

//状态
const state = {
    userInfo: localStorage.getItem("userInfo"),//保存登录用户信息
    userState: localStorage.getItem("userState"),//用户是否登录
    userRefrsh:false,//页面刷新一次
}




//mutations 主要用来操作 state

const mutations ={
    //保存用户数据
    SAVE_USERINFO (state,userInfo){
        console.log("登录函数触发");
        //将登录信息储存到本地
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
        state.userInfo=userInfo;
        console.log("赋值后的用户信息：" +JSON.stringify(state.userInfo));
    },
    //保存用户是否在线状态
    SAVE_USERSTATE (state,isLogin){
        localStorage.setItem("userState", isLogin)
        state.userState=isLogin
        console.log("用户是否在线" + JSON.stringify(state.userState));
    },
    //登录成功，页面进行刷新
    SAVE_REFRESH (state,isRefrsh){
        state.userRefrsh = isRefrsh
    }
}



//创建store仓库暴露出去
export default new Vuex.Store({
    state,
    mutations
})
