<template>
    <div class="container mx-auto pl-4 pr-4">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10">
            <article class="rounded-xl border-2 border-gray-100 bg-white prompts" v-for="(prompt, index) in prompts" :key="index" @click="changePrompt(prompt)">
                <div class="flex items-start gap-4 p-4 sm:p-6">
                    <div>
                        <h3 class="font-medium sm:text-lg">
                            <a href="javascript:;" class="hover:underline">{{ prompt.title }}</a>
                        </h3>

                        <p class="line-clamp-2 text-sm text-gray-700">
                            {{ prompt.content }}
                        </p>
                    </div>
                </div>

                <div class="flex justify-end hidden">
                    <strong class="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-green-600 bg-opacity-80 px-3 py-1.5 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                        <span class="text-[10px] font-medium sm:text-xs">Free</span>
                    </strong>
                </div>
            </article>
        </div>

        <div v-if="isShareDialogOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <!-- 全屏弹窗容器 -->
            <div class="fixed inset-0 bg-white shadow-lg flex flex-col">
                <!-- 弹窗内容 -->
                <div>
                    <div class="main min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-main">
                        <h2 class="text-1xl font-bold mb-2 mt-2 text-center">
                            {{ selectedPrompt.title }}
                            <!-- 关闭按钮 -->
                            <button @click="closeShareDialog" class="absolute right-4 text-gray-600 hover:text-gray-900 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </h2>
                        <!-- 聊天记录区域 -->
                        <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto pb-36 chatContainer">
                            <!-- 消息列表 -->
                            <Message v-for="message in messages" :key="message.id" :message="message" :name="selectedPrompt.title" @preset-click="handlePresetClick" />
                        </div>

                        <!-- 输入框区域 -->
                        <InputBox
                            ref="inputBox"
                            :is-thinking="isThinking"
                            :showMode="false"
                            :mode="mode"
                            :model="model"
                            @send-message="sendMessage"
                            @scroll-to-bottom="scrollToBottom"
                        />
                    </div>
                    <!-- 底部介绍 -->
                    <FooterBox />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from '../ChatBox/MessageBox.vue'
import InputBox from '../ChatBox/InputBox.vue'
import { fetchAIResponse, API_CONFIG } from '../../utils/api'
import { RolePrompts } from '../../utils/prompt.js'

import FooterBox from '../FooterBox.vue'
export default {
    components: {
        Message,
        InputBox,
        FooterBox
    },
    data() {
        return {
            prompts: RolePrompts,
            isShareDialogOpen: false,
            messages: [
                {
                    role: 'assistant',
                    content: '你好！请问有什么可以帮您的？'
                }
            ],
            isThinking: false,
            mode: 'normal',
            model: 'deepseek',
            tab: 'chat',
            selectedPrompt: null
        }
    },
    methods: {
        changePrompt(data) {
            this.selectedPrompt = data
            this.isShareDialogOpen = true
            this.activePrompt = data.description
            this.messages = [
                {
                    role: 'assistant',
                    content: data.content,
                    name: data.title,
                    presets: data.presets
                }
            ]
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

            this.isThinking = false

            this.scrollToBottom()
        },
        async getAIResponse(loadingMessageId) {
            try {
                const systemMessage = this.activePrompt
                const messages = [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    ...this.messages
                        .filter(msg => msg.id !== loadingMessageId) // 排除“加载中”消息
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
        generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substring(2)
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
        closeShareDialog() {
            this.isShareDialogOpen = false // 关闭弹窗
        },
        handlePresetClick(preset) {
            this.$refs.inputBox.roleChange(preset)
        }
    }
}
</script>

<style scoped>
.prompts {
    cursor: pointer;
}
</style>
