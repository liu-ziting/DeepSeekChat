import Vue from 'vue'
import App from './App.vue'
import router from './router' // 确保路径正确
import './index.css'

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

