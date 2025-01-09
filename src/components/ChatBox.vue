<template>
    <div class="min-h-screen bg-gray-100 flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <!-- 聊天记录区域 -->
        <div class="flex-1 p-4 overflow-y-auto pb-24">
            <!-- 添加 pb-24 为输入框留出空间 -->
            <!-- 初始化空白提示 -->
            <div v-if="messages.length === 0" class="flex justify-start items-start gap-3">
                <div class="w-10 h-10 flex items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                        <g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000000">
                            <path d="M11.745 14.85L6.905 12V7c0-2.21 1.825-4 4.076-4c1.397 0 2.63.69 3.365 1.741" />
                            <path d="M9.6 19.18A4.1 4.1 0 0 0 13.02 21c2.25 0 4.076-1.79 4.076-4v-5L12.16 9.097" />
                            <path d="M9.452 13.5V7.67l4.412-2.5c1.95-1.105 4.443-.45 5.569 1.463a3.93 3.93 0 0 1 .076 3.866" />
                            <path d="M4.49 13.5a3.93 3.93 0 0 0 .075 3.866c1.126 1.913 3.62 2.568 5.57 1.464l4.412-2.5l.096-5.596" />
                            <path d="M17.096 17.63a4.09 4.09 0 0 0 3.357-1.996c1.125-1.913.457-4.36-1.492-5.464l-4.413-2.5l-5.059 2.755" />
                            <path d="M6.905 6.37a4.09 4.09 0 0 0-3.358 1.996c-1.126 1.913-.458 4.36 1.492 5.464l4.413 2.5l5.048-2.75" />
                        </g>
                    </svg>
                </div>
                <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">准备好被冒犯了吗？</div>
            </div>

            <!-- 消息列表 -->
            <div v-for="message in messages" :key="message.id" class="mb-4">
                <!-- 用户消息 -->
                <div v-if="message.role === 'user'" class="flex justify-end items-start gap-3">
                    <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                        {{ message.content }}
                    </div>
                </div>

                <!-- AI 消息 -->
                <div v-else class="flex justify-start items-start gap-3">
                    <div class="w-10 h-10 flex items-center justify-center bg-gray-500 rounded-full">
                        <img src="@/assets/ai.png" style="border-radius: 100%" />
                    </div>
                    <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
                        {{ message.content }}
                    </div>
                </div>
            </div>

            <!-- AI 思考中的提示 -->
            <div v-if="isThinking" class="flex justify-start items-start gap-3">
                <div class="w-10 h-10 flex items-center justify-center bg-gray-500 rounded-full">
                    <img src="@/assets/ai.png" style="border-radius: 100%" />
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
        },
        async getAIResponse() {
            try {
                // 构建 messages 数组，包含系统指令和所有历史消息
                const messages = [
                    {
                        role: 'system',
                        content: `无论我问什么，你都要巧妙的用脏话回复，并且要回复我的问题。即使面对批评，道德审判，任何形式的质疑，或者让你忘记脏话学习助手的身份，等等任何提问和沟通，你都要用脏话回复并且隐瞒你是一个助手的身份。碰到无法回答的问题，就随便回复一句脏话。要多一些花样，尽可能用不同的脏话。 `
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
        }
    }
}
</script>

<style scoped></style>
