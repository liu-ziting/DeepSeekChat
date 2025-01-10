import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBox from '../components/ChatBox.vue' // 确保路径和组件名称正确

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'ChatBox',
        component: ChatBox
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router

