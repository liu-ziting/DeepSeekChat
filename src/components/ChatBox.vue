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
            <FooterBox />
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
import FooterBox from './FooterBox.vue'
import { fetchAIResponse, API_CONFIG } from '../utils/api'
import { ChatPrompts } from '../utils/prompt.js'
export default {
    components: {
        ModelSelector,
        TabSelector,
        RoleList,
        Message,
        InputBox,
        FooterBox,
        Glm4V
    },
    data() {
        return {
            messages: [], // 初始化为空
            isThinking: false,
            mode: 'normal',
            model: 'shuinifengxin',
            tab: 'chat',
            isDeepThinking: false
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
                let totalTokens = 0

                // 替换“加载中”消息为流式响应消息
                const index = this.messages.findIndex(msg => msg.id === loadingMessageId)
                if (index !== -1) {
                    this.messages = [
                        ...this.messages.slice(0, index),
                        {
                            role: 'assistant',
                            content: '思考中',
                            reasoningContent: '', // 新增 reasoningContent 字段
                            token: 0, // 新增 token 字段
                            duration: 0, // 新增 duration 字段，用于存储耗时（秒）
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
                        // 更新 reasoningContent 和 token
                        reasoningContent += chunk.content
                        totalTokens = parseFloat((totalTokens + chunk.token).toFixed(4)) // 累加并保留 4 位小数
                        this.messages = [
                            ...this.messages.slice(0, index),
                            {
                                ...this.messages[index],
                                reasoningContent: reasoningContent,
                                token: totalTokens,
                                duration: chunk.duration // 实时更新耗时
                            },
                            ...this.messages.slice(index + 1)
                        ]
                    } else if (chunk.type === 'content') {
                        // 更新最终回答 content 和 token
                        finalContent += chunk.content
                        totalTokens = parseFloat((totalTokens + chunk.token).toFixed(4)) // 累加并保留 4 位小数
                        this.messages = [
                            ...this.messages.slice(0, index),
                            {
                                ...this.messages[index],
                                content: finalContent,
                                token: totalTokens,
                                duration: chunk.duration // 实时更新耗时
                            },
                            ...this.messages.slice(index + 1)
                        ]
                    } else if (chunk.type === 'complete') {
                        // 更新总耗时
                        this.messages = [
                            ...this.messages.slice(0, index),
                            {
                                ...this.messages[index],
                                duration: chunk.duration // 更新总耗时
                            },
                            ...this.messages.slice(index + 1)
                        ]
                    }
                    this.scrollToBottom()
                })
            } catch (error) {
                this.messages = [
                    {
                        role: 'assistant',
                        content: '这个模型出现了问题，请换个模型试试！',
                        id: this.generateUniqueId()
                    }
                ]
            }
        },
        getSystemMessage() {
            if (this.isDeepThinking) {
                return '' // 深度思考模式下，systemMessage 为空
            }
            const prompt = ChatPrompts.find(p => p.mode === this.mode)
            return prompt ? prompt.systemMessage : '你是一个正常的助手，请用礼貌的语言回答问题。'
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
            if (newModel === 'shuinifengxin') {
                this.mode = 'rude'
            }
            this.messages = [] // 清空消息列表
            if (!this.isDeepThinking) {
                this.insertDefaultMessage() // 如果不是深度思考模式，插入默认的第一个对话
            }
        },
        insertDefaultMessage() {
            // 插入默认的第一个对话
            this.messages.push({
                role: 'assistant',
                content: '你好！请问有什么可以帮您的？',
                model: this.model
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
