import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import ChatAI from '../components/MainBox/ChatAI.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'ChatBox',
        component: ChatBox
    },
    {
        path: '/ai',
        name: 'ChatAI',
        component: ChatAI
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
