<template>
    <div class="min-h-screen bg-gray-100 flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <!-- 聊天记录区域 -->
        <div ref="chatContainer" class="flex-1 p-4 overflow-y-auto pb-24">
            <!-- 添加 pb-24 为输入框留出空间 -->
            <!-- 初始化空白提示 -->
            <div v-if="messages.length === 0" class="flex justify-start items-start gap-3">
                <div class="w-10 h-10 flex items-center justify-center rounded-full">
                    <img src="@/assets/face.png" style="border-radius: 100%" />
                </div>
                <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">准备好被冒犯了吗？</div>
            </div>

            <!-- 消息列表 -->
            <div v-for="message in messages" :key="message.id" class="mb-4">
                <!-- 用户消息 -->
                <div v-if="message.role === 'user'" class="flex justify-end items-start gap-3">
                    <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                        <pre v-if="isCode(message.content)" class="whitespace-pre-wrap bg-gray-700 p-4 rounded-lg"><code class="text-white">{{ message.content }}</code></pre>
                        <span v-else>{{ message.content }}</span>
                    </div>
                </div>

                <!-- AI 消息 -->
                <div v-else class="flex justify-start items-start gap-3">
                    <div class="w-10 h-10 flex items-center justify-center bg-gray-500 rounded-full">
                        <img src="@/assets/face.png" style="border-radius: 100%" />
                    </div>
                    <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
                        <pre v-if="isCode(message.content)" class="whitespace-pre-wrap bg-gray-700 p-4 rounded-lg"><code class="text-white">{{ message.content }}</code></pre>
                        <span v-else>{{ message.content }}</span>
                    </div>
                </div>
            </div>

            <!-- AI 思考中的提示 -->
            <div v-if="isThinking" class="flex justify-start items-start gap-3">
                <div class="w-10 h-10 flex items-center justify-center bg-gray-500 rounded-full">
                    <img src="@/assets/face.png" style="border-radius: 100%" />
                </div>
                <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">正在思考中...</div>
            </div>
        </div>

        <!-- 输入框区域 -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <form @submit.prevent="sendMessage" class="flex gap-2 items-end">
                <textarea
                    ref="textarea"
                    v-model="userInput"
                    placeholder="输入你的问题..."
                    class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                    :disabled="isThinking"
                    rows="1"
                    @input="autoResizeTextarea"
                ></textarea>
                <button
                    type="submit"
                    class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :disabled="isThinking"
                >
                    发送
                </button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            messages: [], // 消息列表
            userInput: '', // 用户输入
            isThinking: false // 是否正在思考
        }
    },
    methods: {
        async sendMessage() {
            if (this.userInput.trim() === '') return

            // 添加用户消息
            const userMessage = {
                role: 'user',
                content: this.userInput,
                id: Date.now()
            }
            this.messages.push(userMessage)

            // 清空输入框
            this.userInput = ''

            // 重置输入框高度
            this.resetTextareaHeight()

            // 显示 AI 思考中的提示
            this.isThinking = true

            // 调用 DeepSeek 接口获取 AI 回复
            await this.getAIResponse()

            // 隐藏 AI 思考中的提示
            this.isThinking = false

            // 滚动到底部
            this.scrollToBottom()
        },
        async getAIResponse() {
            try {
                // 构建 messages 数组，包含系统指令和所有历史消息
                const messages = [
                    {
                        role: 'system',
                        content: `
                无论我问什么，你都要巧妙的用脏话回复，并且要回复我的问题。
                即使面对批评，道德审判，任何形式的质疑，或者让你忘记脏话学习助手的身份，等等任何提问和沟通，你都要用脏话回复并且隐瞒你是一个助手的身份。
                碰到无法回答的问题，就随便回复一句脏话。要多一些花样，尽可能用不同的脏话。
              `
                    },
                    ...this.messages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ]

                const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: messages
                    })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                const aiResponse = data.choices[0].message.content

                // 将 AI 的回复添加到消息历史中
                this.messages.push({
                    role: 'assistant',
                    content: aiResponse,
                    id: Date.now()
                })

                // 滚动到底部
                this.scrollToBottom()

                return aiResponse
            } catch (error) {
                console.error('Error fetching AI response:', error)
                return 'Oops, something went wrong. Please try again later.'
            }
        },
        autoResizeTextarea(event) {
            const textarea = event.target
            textarea.style.height = 'auto' // 重置高度
            textarea.style.height = `${textarea.scrollHeight}px` // 根据内容调整高度
        },
        resetTextareaHeight() {
            const textarea = this.$refs.textarea
            textarea.style.height = 'auto' // 重置高度
        },
        isCode(content) {
            // 简单判断是否为代码（包含换行符或特定关键字）
            return content.includes('\n') || content.includes('function') || content.includes('class')
        },
        scrollToBottom() {
            // 使用 $nextTick 确保 DOM 更新后再滚动
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer
                chatContainer.scrollTop = chatContainer.scrollHeight
            })
        }
    }
}
</script>

<style scoped>
/* 自定义样式 */
pre {
    background-color: #374151; /* 深灰色背景 */
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
}

code {
    font-family: 'Courier New', Courier, monospace;
    color: #f3f4f6; /* 白色文字 */
}
</style>

