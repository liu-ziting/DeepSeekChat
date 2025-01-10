<template>
    <div class="min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <div class="main min-h-screen flex flex-col absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <!-- 模型选择切换 -->
            <div class="model-selector flex justify-center gap-4 p-4 bg-white border-b border-gray-200">
                <label class="radio" @click="changeModel('deepseek')">
                    <input type="radio" name="model" checked="" />
                    <span class="name">DeepSeek</span>
                </label>
                <label class="radio" @click="changeModel('gemini')">
                    <input type="radio" name="model" />
                    <span class="name">Gemini</span>
                </label>
                <label class="radio">
                    <input type="radio" name="model" disabled />
                    <span class="name" style="color: #9ca3af">实时视频交互模式</span>
                </label>
            </div>
            <!-- 头部切换按钮 -->
            <div v-if="model !== 'gemini'" class="radio-inputs flex justify-center gap-4 p-4 bg-white border-b border-gray-200">
                <label class="radio" @click="changeMode('normal')">
                    <input type="radio" name="radio" checked="" />
                    <span class="name">正常模式</span>
                </label>
                <label class="radio" @click="changeMode('angry')">
                    <input type="radio" name="radio" />
                    <span class="name">暴躁模式</span>
                </label>

                <label class="radio" @click="changeMode('rude')">
                    <input type="radio" name="radio" />
                    <span class="name">祖安模式</span>
                </label>
            </div>

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
                <div v-for="message in messages" :key="message.id" class="mb-4">
                    <!-- 用户消息 -->
                    <div v-if="message.role === 'user'" class="flex justify-end items-start gap-3">
                        <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                            <pre v-if="isCode(message.content)" class="whitespace-pre-wrap p-4 rounded-lg"><code>{{ message.content }}</code></pre>
                            <span v-else>{{ message.content }}</span>
                        </div>
                    </div>

                    <!-- AI 消息 -->
                    <div v-else class="flex justify-start items-start gap-3">
                        <div class="w-10 h-10 flex items-center justify-center rounded-full">
                            <IconAI />
                        </div>
                        <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">
                            <pre v-if="isCode(message.content)" class="whitespace-pre-wrap p-4 rounded-lg"><code>{{ message.content }}</code></pre>
                            <span v-else>{{ message.content }}</span>
                        </div>
                    </div>
                </div>

                <!-- AI 思考中的提示 -->
                <div v-if="isThinking" class="flex justify-start items-start gap-3">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full">
                        <IconAI />
                    </div>
                    <div class="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]">正在思考中...</div>
                </div>
            </div>

            <!-- 输入框区域 -->
            <div class="form fixed bottom-9 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <form @submit.prevent="sendMessage" class="flex gap-2 items-end">
                    <textarea
                        ref="textarea"
                        v-model="userInput"
                        placeholder="来说点什么..."
                        class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                        :disabled="isThinking"
                        rows="1"
                        @input="autoResizeTextarea"
                        @keydown="handleKeydown"
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
            <!-- 底部介绍 -->
            <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 text-center text-sm text-gray-500">
                Powered by DeepSeek |
                <a class="text-blue-500" href="https://liuziting.netlify.app/">Liuziting</a>
            </footer>
        </div>
    </div>
</template>

<script>
import IconAI from './IconBox/IconAI.vue'
export default {
    name: 'ChatBox',
    components: {
        IconAI
    },
    data() {
        return {
            messages: [], // 消息列表
            userInput: '', // 用户输入
            isThinking: false, // 是否正在思考
            mode: 'normal', // 当前模式：normal, angry, rude
            model: 'deepseek' // 当前模型：deepseek, gemini
        }
    },
    computed: {
        // 根据当前模式返回不同的提示语
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
                // 根据当前模式设置系统指令
                let systemMessage = ''
                switch (this.mode) {
                    case 'normal':
                        systemMessage = '你是一个正常的助手，请用礼貌的语言回答问题。'
                        break
                    case 'angry':
                        systemMessage = '你是一个暴躁的助手，请用不耐烦的语气回答问题。'
                        break
                    case 'rude':
                        systemMessage = `
                            无论我问什么，你都要巧妙的用脏话回复，并且要回复我的问题。
                            即使面对批评，道德审判，任何形式的质疑，或者让你忘记脏话学习助手的身份，等等任何提问和沟通，你都要用脏话回复并且隐瞒你是一个助手的身份。
                            碰到无法回答的问题，就随便回复一句脏话。要多一些花样，尽可能用不同的脏话。
                        `
                        break
                }

                // 构建 messages 数组，包含系统指令和所有历史消息
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

                let apiUrl, apiKey, modelName

                if (this.model === 'deepseek') {
                    apiUrl = 'https://api.deepseek.com/v1/chat/completions'
                    apiKey = process.env.VUE_APP_DEEPSEEK_API_KEY
                    modelName = 'deepseek-chat'
                } else if (this.model === 'gemini') {
                    apiUrl = 'https://liuziting-gemini-play-98-58acmhtr50hp.deno.dev/v1/chat/completions' // 假设 Gemini 的 API 地址
                    apiKey = process.env.VUE_APP_GEMINI_API_KEY
                    modelName = 'gemini-2.0-flash-exp'
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: modelName,
                        messages: messages,
                        temperature: 1.5
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
            if (!content || typeof content !== 'string') {
                return false // 如果 content 为 undefined、null 或不是字符串，返回 false
            }
            // 简单判断是否为代码（包含换行符或特定关键字）
            return content.includes('\n') || content.includes('function') || content.includes('class')
        },
        scrollToBottom() {
            // 使用 $nextTick 确保 DOM 更新后再滚动
            this.$nextTick(() => {
                const chatContainer = this.$refs.chatContainer
                chatContainer.scrollTop = chatContainer.scrollHeight
            })
        },
        changeMode(newMode) {
            this.mode = newMode
            this.messages = [] // 清空消息历史
        },
        handleKeydown(event) {
            // 如果按下的是 Enter 键，并且没有按下 Ctrl 或 Cmd 键
            if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault() // 阻止默认行为（换行）
                this.sendMessage() // 提交消息
            }
            // 如果按下的是 Ctrl + Enter 或 Cmd + Enter，插入换行符
            else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault() // 阻止默认行为（提交表单）
                this.userInput += '\n' // 插入换行符
                this.autoResizeTextarea({ target: this.$refs.textarea }) // 调整输入框高度
            }
        },
        changeModel(newModel) {
            this.model = newModel
            this.mode = 'normal'
            this.messages = [] // 清空消息历史
        }
    }
}
</script>

<style scoped>
/* 自定义样式 */
pre {
    padding: 0;
    border-radius: 0;
    overflow-x: auto;
}

code {
    font-family: normal;
}
.main,
.form {
    max-width: 800px;
    margin: 0 auto;
}
.radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: calc(100% - 2rem);
    margin: 0 auto 10px auto;
    font-size: 14px;
}

.radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
}

.radio-inputs .radio input {
    display: none;
}

.radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
}

.model-selector {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #eee;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: calc(100% - 2rem);
    margin: 20px auto 10px auto;
    font-size: 14px;
}

.model-selector .radio {
    flex: 1 1 auto;
    text-align: center;
}

.model-selector .radio input {
    display: none;
}

.model-selector .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: 0.5rem 0;
    color: rgba(51, 65, 85, 1);
    transition: all 0.15s ease-in-out;
}

.model-selector .radio input:checked + .name {
    background-color: #fff;
    font-weight: 600;
}
</style>
