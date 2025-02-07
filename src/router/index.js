import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import DeepFuck from '../components/DeepFuck.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'ChatBox',
        component: ChatBox
    },
    {
        path: '/deepfuck',
        name: 'DeepFuck',
        component: DeepFuck
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
