<template>
    <div>
        <!-- 底部介绍 -->
        <footer class="fixed bottom-0 left-0 right-0 bg-[#f0f0f0] border-gray-200 p-2 text-center text-sm text-gray-500 z-1">
            <a href="javascript:;" @click="showInfo = true">本项目整合的AI大模型技术生态介绍</a>
            |
            <a href="javascript:;" class="text-blue-500 hover:underline" @click="showWeChatQR = true"> By lztziting </a>
        </footer>
        <div v-if="showWeChatQR" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showWeChatQR = false">
            <div class="bg-white p-4 rounded-lg">
                <img :src="wechatQR" alt="WeChat QR Code" class="w-64 h-100" />
            </div>
        </div>

        <div v-if="showInfo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showInfo = false">
            <CodeBlock :code="modelIntroduce" language="markdown" :showCopyButton="false" />
        </div>
    </div>
</template>

<script>
import CodeBlock from './CodeBlock.vue'
export default {
    components: {
        CodeBlock
    },
    name: 'FooterBox',
    data() {
        return {
            showWeChatQR: false,
            wechatQR: require('@/assets/WeChat.jpg'),
            showInfo: false,
            modelIntroduce: `
🧠 代码/部署
- 本项目90%的代码由大模型自主开发
- 构建工具和技术栈如下
- RooCline+DeepSeek+TailwindCSS
- DeepSeek接口可能会请求慢无响应

🤖 通用对话
- 水泥封心：deepseek-chat
- DeepSeek：deepseek-r1
- 智谱清言：glm-4v-flash
- 月之暗面：moonshot-v1-8k
- Gemini：gemini-2.0-flash

🎭 角色对话
- 智谱清言：glm-4v-flash

🖼️ 图片识别
- 智谱清言：glm-4v-flash

😍 图片生成
- 智谱清言：cogview-3-flash

🎞️ 视频生成
- 智谱清言：cogvideox-flash
            `
        }
    }
}
</script>
<style scoped></style>
