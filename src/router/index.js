import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import ChatAI from '../components/MainBox/ChatAI.vue'
import NsfwAI from '../components/NsfwBox/NsfwAI.vue'
import SexVideo from '../components/SexBox/SexVideo.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'ChatBox',
        component: ChatBox
    },
    {
        path: '/nsfw',
        name: 'NsfwAI',
        component: NsfwAI
    },
    {
        path: '/ai',
        name: 'ChatAI',
        component: ChatAI
    },
    {
        path: '/sex',
        name: 'SexVideo',
        component: SexVideo
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
