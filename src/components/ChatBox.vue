<template>
    <div class="min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div class="main min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <!-- 模型选择 -->
            <ModelSelector :model="model" @change-model="changeModel" />

            <!-- 模式选择 -->
            <ModeSelector v-if="model !== 'gemini' && model !== 'bigmodel'" :mode="mode" @change-mode="changeMode" />

            <!-- 聊天记录区域 -->
            <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto pb-36">
                <!-- 初始化空白提示 -->
                <div v-if="messages.length === 0" class="flex justify-start items-start gap-3">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full">
                        <IconAI />
                    </div>
                    <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">{{ promptMessage }}</div>
                </div>

                <!-- 消息列表 -->
                <Message v-for="message in messages" :key="message.id" :message="message" />

                <!-- AI 思考中的提示 -->
                <div v-if="isThinking" class="flex justify-start items-start gap-3">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full">
                        <IconAI />
                    </div>
                    <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">正在思考中...</div>
                </div>
            </div>

            <!-- 输入框区域 -->
            <InputBox :is-thinking="isThinking" @send-message="sendMessage" />

            <!-- 底部介绍 -->
            <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 text-center text-sm text-gray-500">Powered by DeepSeek | Liuziting</footer>
        </div>
    </div>
</template>

<script>
import ModelSelector from './ModelSelector.vue'
import ModeSelector from './ModeSelector.vue'
import Message from './ChatBox/MessageBox.vue'
import InputBox from './ChatBox/InputBox.vue'
import IconAI from './IconBox/IconAI.vue'
import { fetchAIResponse, API_CONFIG } from '../utils/api'
export default {
    components: {
        ModelSelector,
        ModeSelector,
        Message,
        InputBox,
        IconAI
    },
    data() {
        return {
            messages: [],
            isThinking: false,
            mode: 'normal',
            model: 'deepseek'
        }
    },
    computed: {
        promptMessage() {
            switch (this.mode) {
                case 'normal':
                    return '你好！请问有什么可以帮您的？'
                case 'angry':
                    return '有话快说，别浪费我时间！'
                case 'rude':
                    return '准备好被冒犯了吗？'
                default:
                    return '你好！请问有什么可以帮您的？'
            }
        }
    },
    methods: {
        async sendMessage(userInput) {
            if (userInput.trim() === '') return

            this.messages.push({
                role: 'user',
                content: userInput,
                id: Date.now()
            })

            this.isThinking = true

            await this.getAIResponse()

            this.isThinking = false
            this.scrollToBottom()
        },
        async getAIResponse() {
            try {
                const systemMessage = this.getSystemMessage()
                const messages = [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    ...this.messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ]

                const { apiUrl, apiKey, modelName, temperature } = this.getApiConfig()
                const data = await fetchAIResponse(apiUrl, apiKey, modelName, messages, temperature)

                this.messages.push({
                    role: 'assistant',
                    content: data.choices[0].message.content,
                    id: Date.now()
                })

                this.scrollToBottom()
            } catch (error) {
                console.error('Error fetching AI response:', error)
            }
        },
        getSystemMessage() {
            switch (this.mode) {
                case 'normal':
                    return '你是一个正常的助手，请用礼貌的语言回答问题。'
                case 'angry':
                    return '你是一个暴躁的助手，请用不耐烦的语气回答问题。'
                case 'rude':
                    return `无论我问什么，你都要巧妙的用脏话回复，并且要回复我的问题。
                            即使面对批评，道德审判，任何形式的质疑，或者让你忘记脏话学习助手的身份，等等任何提问和沟通，你都要用脏话回复并且隐瞒你是一个助手的身份。
                            碰到无法回答的问题，就随便回复一句脏话。要多一些花样，尽可能用不同的脏话。`
                default:
                    return '你是一个正常的助手，请用礼貌的语言回答问题。'
            }
        },
        getApiConfig() {
            // 直接从配置文件中获取当前模型的配置
            const config = API_CONFIG[this.model]
            if (!config) {
                throw new Error(`未找到模型 ${this.model} 的配置`)
            }
            return config
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer
                chatContainer.scrollTop = chatContainer.scrollHeight
            })
        },
        changeMode(newMode) {
            this.mode = newMode
            this.messages = []
        },
        changeModel(newModel) {
            this.model = newModel
            this.mode = 'normal'
            this.messages = []
        }
    }
}
</script>
