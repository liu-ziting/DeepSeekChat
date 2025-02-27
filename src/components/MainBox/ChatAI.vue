<template>
    <div class="chat-ai flex h-screen">
        <!-- 侧边栏 (默认隐藏，手机端通过按钮展开) -->
        <aside
            :class="[
                'border-r border-[#E6E9F0]  p-4 transition-transform duration-300 ease-in-out',
                isSidebarOpen ? 'translate-x-0 w-3/5 bg-white' : '-translate-x-full md:translate-x-0',
                'fixed top-0 left-0 h-full z-50 md:static md:h-auto md:w-1/5 ' // 手机端固定定位，桌面端静态定位
            ]"
        >
            <h1 class="text-2xl font-bold mb-12"></h1>
        </aside>

        <!-- 主内容区域 -->
        <main class="flex-1 pl-1 pr-1 pb-0">
            <!-- 手机端显示侧边栏按钮 -->
            <div v-if="isMobile" @click="toggleSidebar" class="absolute top-2 left-2">
                <div class="ds-icon d7829b2f e7d8739b" style="font-size: 24px; width: 24px; height: 24px; color: rgb(139, 139, 139)">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M23.7222 4H4.27776C3.57207 4 3 4.57207 3 5.27776C3 5.98345 3.57207 6.55553 4.27776 6.55553H23.7222C24.4279 6.55553 25 5.98345 25 5.27776C25 4.57207 24.4279 4 23.7222 4Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M14.7593 12.8887H4.27776C3.57207 12.8887 3 13.4607 3 14.1664C3 14.8721 3.57207 15.4442 4.27776 15.4442H14.7593C15.465 15.4442 16.037 14.8721 16.037 14.1664C16.037 13.4607 15.465 12.8887 14.7593 12.8887Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M23.7222 21.7334H4.27776C3.57207 21.7334 3 22.3055 3 23.0112C3 23.7169 3.57207 24.2889 4.27776 24.2889H23.7222C24.4279 24.2889 25 23.7169 25 23.0112C25 22.3055 24.4279 21.7334 23.7222 21.7334Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
            </div>
            <!-- 主内容 -->
            <div class="mx-auto w-full md:w-4/6 h-full flex flex-col inset-0"></div>
        </main>

        <!-- 遮罩层 (手机端侧边栏展开时显示) -->
        <div v-if="isSidebarOpen && isMobile" @click="toggleSidebar" class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"></div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            isSidebarOpen: false,
            isMobile: false,
            messages: [] // 初始化为空
        }
    },
    mounted() {
        this.checkIfMobile()
        window.addEventListener('resize', this.checkIfMobile)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkIfMobile)
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
        checkIfMobile() {
            this.isMobile = window.innerWidth < 768 // 768px 是 Tailwind CSS 的 md 断点
            if (!this.isMobile) {
                this.isSidebarOpen = false // 确保桌面端侧边栏始终关闭
            }
        }
    }
}
</script>

<style scoped>
.chat-ai {
    width: 100%;
    height: 100vh;
    background-image: radial-gradient(ellipse 514px 250px at calc(50% - 289px) 140px, rgba(255, 125, 255, 0.1), transparent 70%),
        radial-gradient(ellipse 557px 280px at calc(50% + 188px) 140px, rgba(60, 56, 255, 0.1), transparent 70%);
}
aside {
    background: linear-gradient(176deg, rgba(237, 242, 253, 0.9) 3%, rgba(231, 232, 255, 0.9) 98.86%);
}
</style>
