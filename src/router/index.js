import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import ChatAI from '../components/MainBox/ChatAI.vue'
import NsfwAI from '../components/NsfwBox/NsfwAI.vue'
import SexyVideo from '../components/SexyBox/SexyVideo.vue'

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
        path: '/sexy',
        name: 'SexyVideo',
        component: SexyVideo
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router
