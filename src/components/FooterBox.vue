<template>
    <div>
        <!-- 底部介绍 -->
        <footer class="fixed bottom-1 left-3 right-3 border-gray-200 text-xs text-center text-gray-500 z-1">
            <a href="javascript:;" class="text-black-500" @click="showInfo = true">本项目集成大模型技术生态</a>
            |
            <a href="javascript:;" class="text-black-500" @click="showWeChatQR = true"> 联系作者 </a>
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
- RooCline+DeepSeek+TailwindCSS
🤖 多模型
- DeepSeek：deepseek-r1
- Gemini：gemini-2.0-flash
- GPT：gpt-3.5-turbo
- 智谱清言：glm-4v-flash
- 月之暗面：moonshot-v1-8k
- 零一万物：yi-lightning
- 通义千问：qwen-max
- 阶跃星辰：step-1-flash
- 百川智能：Baichuan4-Air
- MINIMAX：MiniMax-Text-01
- 通义千问QwQ：QwQ-32B
- Llama：llama-3.3-70b
- Gemma：gemma-3-27b-it
- Mistral：mistral-small-24b
大部分模型免费，部分国内模型提供初始额度
🎭 角色对话
- DeepSeek：deepseek-v3
🖼️ 图片识别/语音合成
- 阶跃星辰：step-1o-turbo-vision
- 阶跃星辰：step-tts-mini
😍 图片生成
- 智谱清言：cogview-3-flash

 `
        }
    }
}
</script>
<style scoped></style>
