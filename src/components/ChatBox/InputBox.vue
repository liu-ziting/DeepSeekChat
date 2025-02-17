<template>
    <div style="border-radius: 6px 6px 0 0" class="form fixed bottom-9 left-0 right-0 bg-[#f0f0f0] border-gray-200 pl-2 pr-2 pt-4 pb-2">
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

        <button
            v-if="(model === 'deepseek' || model === 'deepThinking') && showMode"
            class="inline-flex items-center cursor-pointer px-2 py-1 rounded-full transition-colors"
            :class="isDeepThinking ? 'bg-[#DBEAFE] border-[#4D6BFE] text-[#4D6BFE]' : 'bg-gray-200 border-gray-400 text-gray-600'"
            @click="toggleDeepThinking"
            style="position: absolute; right: 5px; top: 8px"
        >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298.43-.3.301-.436.774-.428 1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width=".1"
                ></path>
                <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
            </svg>
            <span class="text-sm">深度思考</span>
        </button>

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
                class="text-sm flex-1 px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 resize-none overflow-hidden"
                :disabled="isThinking"
                rows="1"
                @input="handleInput"
                @keydown="handleKeydown"
            ></textarea>
            <button
                type="submit"
                class="text-sm px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300"
                :disabled="isThinking"
            >
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
