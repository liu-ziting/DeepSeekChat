<template>
    <div class="size-full pt-safe md:p-2" style="height: 100vh">
        <main
            class="deep-fuck flex size-full flex-col bg-white ring-4 ring-[#e6e6e6] dark:bg-[#161616] dark:ring-[#222222] md:rounded-md"
            style="background-image: radial-gradient(circle at center top, transparent 3200px, transparent 4000px)"
        >
            <div
                class="deep-fuck relative flex flex-1 flex-col items-stretch justify-between overflow-hidden border border-neutral-200/70 will-change-contents dark:border-neutral-800/70 md:m-1.5 md:rounded-md"
            >
                <div
                    class="relative scrollbar-none flex flex-wrap content-start w-full h-full pt-2 overflow-hidden bg-background dark:bg-background md:content-center md:pt-0 overflow-y-auto pb-8"
                >
                    <div class="relative z-10 w-full">
                        <div class="w-full space-y-4" style="opacity: 1; transform: none">
                            <div class="max-w-[800px] mx-auto px-4">
                                <div class="mb-1 text-left" style="opacity: 1; transform: none">
                                    <h1
                                        class="mb-2 text-2xl tracking-tight text-transparent font-geist-mono md:text-3xl bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400"
                                    >
                                        DeepFuck
                                    </h1>
                                    <p class="mb-4 text-sm tracking-tight font-geist-mono md:text-base text-neutral-600 dark:text-neutral-400">准备好被AI冒犯了吗？</p>
                                </div>
                                <div ref="chatContainer" class="flex-1 overflow-y-auto max-h-[calc(100vh-335px)]">
                                    <Message v-for="message in messages" :key="message.id" :message="message" />
                                </div>
                                <div
                                    id="blank-page-content"
                                    class="relative p-2 backdrop-blur-sm bg-white/50 dark:bg-black/50 z-[90] border border-neutral-200/50 dark:border-white/15 rounded-2xl transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/5 before:to-white/10 dark:before:from-neutral-800/50 dark:before:to-neutral-800/30"
                                    style="box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px"
                                >
                                    <div
                                        class="relative flex items-start justify-between w-full overflow-hidden border rounded-t-lg group min-h-32 rounded-xl border-neutral-300/50 bg-gradient-to-tr from-neutral-50 to-neutral-200 dark:border-neutral-50/20 dark:from-neutral-800 dark:to-neutral-900"
                                    >
                                        <div class="flex-1 min-h-24 pb-10">
                                            <textarea
                                                v-model="userInput"
                                                placeholder="问 AI 任何问题..."
                                                class="w-full p-4 pr-0 text-sm bg-transparent outline-none resize-none mark-scroll-bar font-geist-mono min-h-24"
                                                enterkeyhint="send"
                                                @keydown="handleKeydown"
                                            ></textarea>
                                        </div>
                                        <div class="absolute flex gap-2 bottom-2 right-2">
                                            <button
                                                @click="handleSubmit"
                                                data-accent-color="gray"
                                                style="width: 80px; height: 32px; padding: 0 12px; border-radius: 5px"
                                                class="rt-reset rt-BaseButton rt-r-size-2 rt-variant-soft rt-Button width-[76px] cursor-pointer bg-neutral-400/20 font-medium text-[rgba(101,101,101,1)] duration-200 hover:scale-[0.95] hover:opacity-90 hover:ring-1 hover:ring-indigo-500/50 dark:bg-neutral-500/20 dark:text-neutral-200"
                                            >
                                                开始
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex flex-col w-full gap-2 translate-y-2 relative z-[90]">
                                        <div class="items-center justify-between block w-full md:flex mb-2">
                                            <div class="mb-4 whitespace-nowrap md:mb-0">
                                                <div class="flex"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import Message from './ChatBox/MessageDe.vue'
import { fetchAIResponse, API_CONFIG } from '../utils/api'
import { ChatPrompts } from '../utils/prompt.js'
import { autoResizeTextarea } from '../utils/helpers'

export default {
    components: {
        Message
    },
    data() {
        return {
            messages: [], // 初始化为空
            isThinking: false,
            mode: 'rude',
            model: 'deepseek',
            tab: 'chat',
            isDeepThinking: false,
            userInput: ''
        }
    },
    methods: {
        handleSubmit() {
            this.sendMessage(this.userInput)
            this.scrollToBottom()
        },
        handleKeydown(event) {
            if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault()
                this.handleSubmit()
            } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                this.userInput += '\n'
                autoResizeTextarea(this.$refs.textarea)
            }
        },
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

            this.scrollToBottom()

            this.isThinking = false
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
        generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2)
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
        }
    },
    mounted() {}
}
</script>
<style scoped></style>
