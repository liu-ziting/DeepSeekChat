<template>
    <div class="container mx-auto pl-4 pr-4">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10">
            <article class="rounded-xl border-2 border-gray-100 bg-white prompts" v-for="(prompt, index) in prompts" :key="index" @click="changePrompt(prompt)">
                <div class="flex items-start gap-4 p-2 sm:p-4">
                    <div>
                        <h3 class="font-medium sm:text-md">
                            <a href="javascript:;" class="hover:underline">{{ prompt.title }}</a>
                        </h3>

                        <p class="line-clamp-2 text-sm text-gray-400">
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
                        <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto pb-2 chatContainer">
                            <!-- 消息列表 -->
                            <Message
                                v-for="message in messages"
                                :key="message.id"
                                :message="message"
                                :name="selectedPrompt.title"
                                @preset-click="handlePresetClick"
                                :showName="false"
                                :roleImgUrl="roleImgUrl"
                            />
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
            model: 'gpt35',
            tab: 'chat',
            selectedPrompt: null,
            abortController: null // 用来保存 AbortController 实例
        }
    },
    methods: {
        changePrompt(data) {
            this.selectedPrompt = data
            this.isShareDialogOpen = true
            this.activePrompt = data.description
            this.roleImgUrl = data.imgurl || ''
            this.messages = [
                {
                    role: 'assistant',
                    content: data.content,
                    name: data.title,
                    presets: data.presets,
                    model: this.model
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

            // 创建新的 AbortController 实例
            this.abortController = new AbortController()
            // 获取 AI 响应
            await this.getAIResponse(loadingMessage.id, this.abortController)

            this.isThinking = false

            this.scrollToBottom()
        },
        async getAIResponse(loadingMessageId, controller) {
            try {
                const systemMessage = this.activePrompt
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
                            this.messages = [
                                ...this.messages.slice(0, index),
                                { ...this.messages[index], reasoningContent, token: totalTokens, duration: chunk.duration },
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
                        this.scrollToBottom()
                    },
                    controller
                )
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.messages = [{ role: 'assistant', content: '这个模型出现了问题，请换个模型试试！', id: this.generateUniqueId() }]
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
            // 如果有正在进行的请求，取消它
            if (this.abortController) {
                this.abortController.abort()
            }
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
