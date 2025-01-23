<template>
    <div class="min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-main">
        <div class="main min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full">
            <!-- 模型选择 -->
            <TabSelector :tab="tab" @tab-selected="changeTab" />
            <template v-if="tab === 'chat'">
                <ModelSelector v-if="!isDeepThinking" :model="model" @change-model="changeModel" />

                <!-- 聊天记录区域 -->
                <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto pb-36 chatContainer">
                    <!-- 消息列表 -->
                    <Message v-for="message in messages" :key="message.id" :message="message" />
                </div>

                <!-- 输入框区域 -->
                <InputBox
                    :is-thinking="isThinking"
                    :showMode="true"
                    :mode="mode"
                    :model="model"
                    @send-message="sendMessage"
                    @scroll-to-bottom="scrollToBottom"
                    @change-mode="changeMode"
                    @toggle-deep-thinking="toggleDeepThinking"
                />
            </template>
            <!-- 大模型竞技场 -->
            <template v-else-if="tab === 'battle'">
                <iframe
                    src="https://bisheng.dataelem.com/chat/flow/f6e1f49e-7d84-4f83-bd0a-bb8874b7833a"
                    style="width: 100%; height: 100%; min-height: 700px"
                    frameborder="0"
                    allow="fullscreen;clipboard-write"
                >
                </iframe>
            </template>
            <!-- 角色对话 -->
            <template v-else-if="tab === 'role'">
                <RoleList />
            </template>
            <!-- 图片识别大模型-智谱 -->
            <template v-else>
                <Glm4V />
            </template>

            <!-- 底部介绍 -->
            <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 text-center text-sm text-gray-500 z-1">
                <a href="javascript:;" @click="showInfo = true">本项目整合的AI大模型技术生态介绍</a>
                |
                <a href="javascript:;" class="text-blue-500 hover:underline" @click="showWeChatQR = true"> By lztziting </a>
            </footer>
        </div>

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
import ModelSelector from './ModelSelector.vue'
import RoleList from './RoleBox/RoleList.vue'
import TabSelector from './TabSelector.vue'
import Message from './ChatBox/MessageBox.vue'
import InputBox from './ChatBox/InputBox.vue'
import Glm4V from './ImgBox/Glm4V.vue'
import CodeBlock from './CodeBlock.vue'
import { fetchAIResponse, API_CONFIG } from '../utils/api'

export default {
    components: {
        ModelSelector,
        TabSelector,
        RoleList,
        Message,
        InputBox,
        Glm4V,
        CodeBlock
    },
    data() {
        return {
            messages: [], // 初始化为空
            isThinking: false,
            mode: 'normal',
            model: 'deepseek',
            tab: 'chat',
            isDeepThinking: false,
            showWeChatQR: false,
            wechatQR: require('@/assets/WeChat.jpg'),
            showInfo: false,
            modelIntroduce: `
🧠 大模型接口

🤖 通用对话
- DeepSeek：deepseek-chat
- Gemini：gemini-2.0-flash-exp
- 智谱清言：glm-4v-flash
- 月之暗面：moonshot-v1-8k
- 深度思考：deepseek-reasoner
  （目前算力翻倍，暂时不开放...）

🎭 角色对话
- Gemini：gemini-2.0-flash-exp

🏟️ 大模型竞技场
- 毕昇BISHENG开源LLM应用开发平台

🖼️ 识图
- 智谱清言：glm-4v-flash
            `
        }
    },
    methods: {
        async sendMessage(userInput) {
            if (userInput.trim() === '') return

            // 插入用户消息
            this.messages.push({
                role: 'user',
                content: userInput,
                id: Date.now()
            })

            // 插入“加载中”临时消息
            const loadingMessage = {
                role: 'assistant',
                content: '思考中',
                id: 'loading-' + Date.now()
            }
            this.messages.push(loadingMessage)

            this.isThinking = true

            // 获取 AI 响应
            await this.getAIResponse(loadingMessage.id)

            this.isThinking = false

            this.scrollToBottom()
        },
        generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2)
        },
        async getAIResponse(loadingMessageId) {
            try {
                const systemMessage = this.getSystemMessage()
                const messages = [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    ...this.messages
                        .filter(msg => msg.id !== loadingMessageId)
                        .map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                ]

                const { apiUrl, apiKey, modelName, temperature } = this.getApiConfig()

                // 用于存储流式响应的内容
                let reasoningContent = ''
                let finalContent = ''

                // 替换“加载中”消息为流式响应消息
                const index = this.messages.findIndex(msg => msg.id === loadingMessageId)
                if (index !== -1) {
                    this.messages = [
                        ...this.messages.slice(0, index),
                        {
                            role: 'assistant',
                            content: '思考中',
                            reasoningContent: '', // 新增 reasoningContent 字段
                            id: this.generateUniqueId(),
                            mode: this.mode,
                            model: this.model
                        },
                        ...this.messages.slice(index + 1)
                    ]
                }

                const stream = true
                await fetchAIResponse(apiUrl, apiKey, modelName, messages, temperature, stream, chunk => {
                    if (chunk.type === 'reasoning') {
                        // 更新 reasoningContent
                        reasoningContent += chunk.content
                        this.messages = [
                            ...this.messages.slice(0, index),
                            {
                                ...this.messages[index],
                                reasoningContent: reasoningContent
                            },
                            ...this.messages.slice(index + 1)
                        ]
                    } else if (chunk.type === 'content') {
                        // 更新最终回答 content
                        finalContent += chunk.content
                        this.messages = [
                            ...this.messages.slice(0, index),
                            {
                                ...this.messages[index],
                                content: finalContent
                            },
                            ...this.messages.slice(index + 1)
                        ]
                    }
                    this.scrollToBottom()
                })
            } catch (error) {
                console.error('Error fetching AI response:', error)
                const index = this.messages.findIndex(msg => msg.id === loadingMessageId)
                if (index !== -1) {
                    this.messages = [
                        ...this.messages.slice(0, index),
                        {
                            role: 'assistant',
                            content: '请求失败，请稍后重试。',
                            id: this.generateUniqueId()
                        },
                        ...this.messages.slice(index + 1)
                    ]
                }
            }
        },
        getSystemMessage() {
            if (this.isDeepThinking) {
                return '' // 深度思考模式下，systemMessage 为空
            }
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
            this.messages = [] // 清空消息列表
            if (!this.isDeepThinking) {
                this.insertDefaultMessage() // 如果不是深度思考模式，插入默认的第一个对话
            }
        },
        changeModel(newModel) {
            this.model = newModel
            this.mode = 'normal' // 重置为默认模式
            this.messages = [] // 清空消息列表
            if (!this.isDeepThinking) {
                this.insertDefaultMessage() // 如果不是深度思考模式，插入默认的第一个对话
            }
        },
        insertDefaultMessage() {
            // 插入默认的第一个对话
            this.messages.push({
                role: 'assistant',
                content: '你好！请问有什么可以帮您的？'
            })
        },
        changeTab(newTab) {
            this.tab = newTab
        },
        // 切换深度思考
        toggleDeepThinking(isDeepThinking) {
            this.isDeepThinking = isDeepThinking
            if (isDeepThinking) {
                // 深度思考模式下，清空消息列表
                this.messages = []
                this.model = 'deepThinking'
            } else {
                this.model = 'deepseek'
                // 非深度思考模式下，插入默认的第一个对话
                this.insertDefaultMessage()
            }
        }
    },
    mounted() {
        // 获取Url中的参数model 然后赋值给this.model
        const urlParams = new URLSearchParams(window.location.search)
        const modelParam = urlParams.get('model')
        const tabParam = urlParams.get('tab')
        if (modelParam) {
            this.model = modelParam
        }
        if (tabParam) {
            this.tab = tabParam
        }

        // 初始化时根据深度思考状态决定是否插入默认消息
        if (!this.isDeepThinking) {
            this.insertDefaultMessage()
        }
    }
}
</script>
