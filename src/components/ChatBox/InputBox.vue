<template>
    <div class="form fixed bottom-9 left-0 right-0 border-gray-200 pl-2 pr-2 pt-4">
        <!-- 模型切换下拉菜单 -->
        <div v-if="(model === 'deepseek' || model === 'deepThinking') && showMode" class="mb-2" style="width: 80%; margin-top: -5px">
            <div>
                <!-- 正常模式 -->
                <label @click="changeMode('normal')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'normal'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'normal' }">😀</span>
                        正常
                    </span>
                </label>

                <!-- 暴躁模式 -->
                <label @click="changeMode('angry')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'angry'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'angry' }">😡</span>
                        暴躁
                    </span>
                </label>

                <!-- 祖安模式 -->
                <label @click="changeMode('rude')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'rude'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'rude' }">🤬</span>
                        有点脏
                    </span>
                </label>
            </div>
        </div>
        <!-- <div v-if="isDeepThinking" class="mb-3 text-sm text-gray-400 w-80" style="margin-top: -5px">已启用DeepSeek深度思考模式</div> -->

        <!-- 深度思考开关 -->
        <label
            v-if="(model === 'deepseek' || model === 'deepThinking') && showMode"
            class="inline-flex items-center cursor-pointer"
            style="position: absolute; right: 1rem; top: 10px; float: right"
        >
            <!-- 使用 ref 操作 DOM 元素的 checked 属性 -->
            <input type="checkbox" class="sr-only peer" :checked="isDeepThinking" ref="deepThinkingSwitch" @change="toggleDeepThinking" />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
        </label>

        <!-- 密码输入模态框 -->
        <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <h3 class="text-lg font-semibold mb-4">深度思考模式消耗算力翻倍！</h3>
                <input
                    type="password"
                    v-model="passwordInput"
                    placeholder="输入密码"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="mt-4 flex justify-end">
                    <button
                        @click="cancelPasswordInput"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        取消
                    </button>
                    <button
                        @click="confirmPasswordInput"
                        class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        确认
                    </button>
                </div>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="flex gap-2 items-end w-full">
            <textarea
                ref="textarea"
                v-model="userInput"
                :placeholder="placeholder"
                class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                :disabled="isThinking"
                rows="1"
                @input="handleInput"
                @keydown="handleKeydown"
            ></textarea>
            <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="isThinking">
                发送
            </button>
        </form>
    </div>
</template>

<script>
import { autoResizeTextarea, resetTextareaHeight } from '../../utils/helpers'

export default {
    props: {
        isThinking: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        showMode: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        userInput() {
            this.$nextTick(() => {
                autoResizeTextarea(this.$refs.textarea)
            })
        }
    },
    data() {
        return {
            placeholder: '来说点什么...',
            userInput: '',
            selectedModel: 'model1', // 默认选择的模型
            isDeepThinking: false, // 深度思考开关状态
            showPasswordModal: false, // 控制密码模态框的显示与隐藏
            passwordInput: '', // 用户输入的密码
            correctPassword: '1313ljjmtdsxxx' // 正确的密码
        }
    },
    methods: {
        handleInput(event) {
            autoResizeTextarea(event.target)
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
        handleSubmit() {
            this.$emit('send-message', this.userInput, this.selectedModel)
            this.userInput = ''
            resetTextareaHeight(this.$refs.textarea)
            this.$emit('scroll-to-bottom')
        },
        roleChange(preset) {
            this.userInput = preset
            this.handleSubmit()
        },
        changeMode(newMode) {
            this.$emit('change-mode', newMode)
        },
        toggleDeepThinking() {
            if (!this.isDeepThinking) {
                // 如果当前是关闭状态，点击后弹出密码输入框
                // this.showPasswordModal = true
                this.isDeepThinking = true
                this.showPasswordModal = false
                this.passwordInput = ''
                this.placeholder = '已启用DeepSeek深度思考模式'
            } else {
                // 如果当前是开启状态，直接关闭
                this.isDeepThinking = false
                this.placeholder = '来说点什么...'
            }
            this.$emit('toggle-deep-thinking', this.isDeepThinking)
        },
        confirmPasswordInput() {
            if (this.passwordInput === this.correctPassword) {
                this.isDeepThinking = true
                this.$emit('toggle-deep-thinking', this.isDeepThinking)
                this.showPasswordModal = false
                this.passwordInput = ''
            } else {
                alert('密码错误，请重试')
                this.passwordInput = ''
                // 密码错误时，恢复开关状态
                this.$refs.deepThinkingSwitch.checked = false
            }
        },
        cancelPasswordInput() {
            this.showPasswordModal = false
            this.passwordInput = ''
            // 取消时，恢复开关状态
            this.$refs.deepThinkingSwitch.checked = false
            // 保持深度思考模式关闭
            this.isDeepThinking = false
        }
    }
}
</script>
