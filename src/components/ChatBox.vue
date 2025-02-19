<template>
    <div class="min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-main">
        <div class="main min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full">
            <!-- 模型选择 -->
            <TabSelector :tab="tab" @tab-selected="changeTab" />
            <template v-if="tab === 'chat'">
                <ModelSelector v-if="!isDeepThinking" :model="model" @change-model="changeModel" />

                <!-- 聊天记录区域 -->
                <div ref="chatContainer" class="flex-1 p-2 overflow-y-auto pb-2 chatContainer">
                    <!-- 消息列表 -->
                    <Message v-for="message in messages" :key="message.id" :message="message" />
                </div>

                <!-- 输入框区域 -->
                <InputBox
                    ref="inputBox"
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
            <template v-else-if="tab === 'image'">
                <Glm4V />
            </template>
            <!-- 生图大模型 -->
            <template v-else-if="tab === 'cogview'">
                <CogView />
            </template>
            <!-- 视频生成大模型 -->
            <template v-else-if="tab === 'textvideo'">
                <VideoGlm />
            </template>
            <template v-else-if="tab === 'imgvideo'">
                <VideoImg />
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
import CogView from './ImgBox/CogView.vue'
import VideoGlm from './ImgBox/VideoGlm.vue'
import VideoImg from './ImgBox/VideoImg.vue'
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
        Glm4V,
        CogView,
        VideoGlm,
        VideoImg
    },
    data() {
        return {
            messages: [], // 初始化为空
            isThinking: false,
            mode: 'angry',
            model: 'shuinifengxin',
            tab: 'chat',
            isDeepThinking: false,
            abortController: null // 用来保存 AbortController 实例
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

            const loadingMessage = {
                role: 'assistant',
                content: '思考中',
                id: 'loading-' + Date.now()
            }
            this.messages.push(loadingMessage)

            this.isThinking = true

            // 创建新的 AbortController 实例
            this.abortController = new AbortController()

            // 获取 AI 响应，传入 abortController
            await this.getAIResponse(loadingMessage.id, this.abortController)

            this.isThinking = false
            this.scrollToBottom()
        },
        async getAIResponse(loadingMessageId, controller) {
            try {
                const systemMessage = this.getSystemMessage()
                const messages = [
                    { role: 'system', content: systemMessage },
                    ...this.messages.filter(msg => msg.id !== loadingMessageId).map(msg => ({ role: msg.role, content: msg.content }))
                ]

                const { apiUrl, apiKey, modelName, temperature } = this.getApiConfig()

                let reasoningContent = ''
                let finalContent = ''
                let totalTokens = 0

                const index = this.messages.findIndex(msg => msg.id === loadingMessageId)
                if (index !== -1) {
                    this.messages = [
                        ...this.messages.slice(0, index),
                        {
                            role: 'assistant',
                            content: '思考中',
                            reasoningContent: '',
                            token: 0,
                            duration: 0,
                            id: this.generateUniqueId(),
                            mode: this.mode,
                            model: this.model
                        },
                        ...this.messages.slice(index + 1)
                    ]
                }

                const stream = true
                await fetchAIResponse(
                    apiUrl,
                    apiKey,
                    modelName,
                    messages,
                    temperature,
                    stream,
                    chunk => {
                        if (controller.signal.aborted) {
                            return // 请求被中止，退出
                        }

                        if (chunk.type === 'reasoning') {
                            reasoningContent += chunk.content
                            totalTokens = parseFloat((totalTokens + chunk.token).toFixed(4))

                            // 获取当前消息对象
                            const currentMessage = this.messages[index]

                            // 如果是第一次进入 reasoning 阶段，记录开始时间
                            if (!currentMessage.reasoningStartTime) {
                                currentMessage.reasoningStartTime = Date.now()
                            }

                            // 计算深度思考持续时间
                            const currentTime = Date.now()
                            currentMessage.reasoningDuration = parseFloat(((currentTime - currentMessage.reasoningStartTime) / 1000).toFixed(1))

                            this.messages = [
                                ...this.messages.slice(0, index),
                                { ...currentMessage, reasoningContent, token: totalTokens, duration: chunk.duration }, // 更新消息对象
                                ...this.messages.slice(index + 1)
                            ]
                        } else if (chunk.type === 'content') {
                            finalContent += chunk.content
                            totalTokens = parseFloat((totalTokens + chunk.token).toFixed(4))
                            this.messages = [
                                ...this.messages.slice(0, index),
                                { ...this.messages[index], content: finalContent, token: totalTokens, duration: chunk.duration },
                                ...this.messages.slice(index + 1)
                            ]
                        } else if (chunk.type === 'complete') {
                            this.messages = [...this.messages.slice(0, index), { ...this.messages[index], duration: chunk.duration }, ...this.messages.slice(index + 1)]
                        }
                        this.conditionalScrollToBottom()
                    },
                    controller
                )
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.messages = [{ role: 'assistant', content: '这个模型出现了问题，请换个模型试试！', id: this.generateUniqueId() }]
                }
            }
        },
        conditionalScrollToBottom() {
            const chatContainer = this.$refs.chatContainer
            if (!chatContainer) return // Ensure container exists

            const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50 // Add a tolerance of 50px

            if (isAtBottom) {
                this.scrollToBottom()
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer
                chatContainer.scrollTop = chatContainer.scrollHeight
            })
        },
        generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2)
        },
        getSystemMessage() {
            // if (this.isDeepThinking) {
            //     return '' // 深度思考模式下，systemMessage 为空
            // }
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
        changeMode(newMode) {
            // 如果有正在进行的请求，取消它
            if (this.abortController) {
                this.abortController.abort()
            }
            this.mode = newMode
            this.messages = [] // 清空消息列表
            if (!this.isDeepThinking) {
                this.insertDefaultMessage() // 如果不是深度思考模式，插入默认的第一个对话
            }
            this.isThinking = false
        },
        changeModel(newModel) {
            // 如果有正在进行的请求，取消它
            if (this.abortController) {
                this.abortController.abort()
            }

            this.model = newModel
            if (newModel === 'shuinifengxin') {
                this.mode = 'rude'
            } else {
                this.mode = 'normal'
            }
            this.messages = [] // 清空消息列表

            if (!this.isDeepThinking) {
                this.insertDefaultMessage() // 插入默认对话
            }
            this.isThinking = false
            this.$refs.inputBox.init()
        },
        insertDefaultMessage() {
            let messageContent = '你好！请问有什么可以帮您的？'

            this.messages.push({
                role: 'assistant',
                content: messageContent,
                model: this.model
            })
        },
        changeTab(newTab) {
            this.tab = newTab
            this.isDeepThinking = false
            this.model = 'shuinifengxin'
            this.messages = []
            this.insertDefaultMessage()
        },
        // 切换深度思考
        toggleDeepThinking(isDeepThinking) {
            this.isDeepThinking = isDeepThinking
            if (isDeepThinking) {
                // 深度思考模式下，清空消息列表
                // this.messages = []
                this.model = 'deepThinking'
            } else {
                this.model = 'deepseek'
                // 非深度思考模式下，插入默认的第一个对话
                // this.insertDefaultMessage()
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
