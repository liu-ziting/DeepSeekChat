<template>
    <div class="">
        <!-- 模型选择 -->
        <div v-if="showMode" class="flex items-center justify-between">
            <button
                @click="openModelDialog"
                style="border: 1px solid #d9d9d9"
                class="bg-[#ffffff] model-select inline-flex items-center cursor-pointer px-2 py-1 ml-1 rounded-full transition-colors"
            >
                <img :src="selectedModelImg" class="w-5 h-5 rounded-full border-gray-300" />
                <span class="pl-1" style="font-size: 12px"> {{ selectedModel }} </span>
                <svg
                    t="1740124860020"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5352"
                    width="16"
                    height="16"
                    :class="{ 'rotate-180': isShareDialogOpen }"
                    style="transition: transform 0.2s ease"
                >
                    <path
                        d="M512 574.72l-183.168-183.168a10.666667 10.666667 0 0 0-15.082667 0l-30.165333 30.165333a10.666667 10.666667 0 0 0 0 15.082667l198.250667 198.250667a42.666667 42.666667 0 0 0 60.330666 0l198.250667-198.250667a10.666667 10.666667 0 0 0 0-15.082667l-30.165333-30.165333a10.666667 10.666667 0 0 0-15.082667 0L512 574.698667z"
                        fill="#313233"
                        p-id="5353"
                    ></path>
                </svg>
            </button>
            <!-- 模式选择 -->
            <div v-if="model === 'deepseek' || model === 'deepThinking'" class="w-1/2 flex justify-end">
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
            <!-- 模型弹出层 -->
            <div v-if="isShareDialogOpen" @click.self="isShareDialogOpen = false" class="propup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white rounded-lg p-6 shadow-lg w-96">
                    <div class="flex flex-col items-left">
                        <h2 class="text-md font-semibold text-gray-800 mb-4">选择模型</h2>

                        <div class="w-full">
                            <div class="grid grid-cols-2 gap-2">
                                <label
                                    v-for="model in models"
                                    :key="model.name"
                                    @click="changeModel(model)"
                                    class="relative group flex items-center p-2 rounded-md border border-gray-300 cursor-pointer hover:shadow-md transition-shadow focus:outline-none peer-checked:bg-blue-100 peer-checked:border-blue-500"
                                    :class="{ 'border-blue-500': selectedModel === model.name }"
                                >
                                    <input type="radio" name="model" value="model1" class="peer sr-only" aria-hidden="true" />
                                    <img :src="model.img" alt="Model 1 Icon" class="w-5 h-5 mr-2 rounded border-gray-300" />
                                    <span class="text-gray-700 text-sm">{{ model.name }}</span>
                                    <span v-if="selectedModel === model.name" class="text-green-500 ml-1 absolute right-2">
                                        <svg
                                            t="1740124477021"
                                            class="icon"
                                            viewBox="0 0 1024 1024"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            p-id="3639"
                                            width="25"
                                            height="25"
                                        >
                                            <path
                                                d="M512 126.464c212.48 0 385.536 173.056 385.536 385.536s-173.056 385.536-385.536 385.536-385.536-173.056-385.536-385.536S299.52 126.464 512 126.464m0-20.48c-224.256 0-406.016 181.76-406.016 406.016s181.76 406.016 406.016 406.016 406.016-181.76 406.016-406.016-181.76-406.016-406.016-406.016z"
                                                fill="#4E63DD"
                                                opacity=".1"
                                                p-id="3640"
                                            ></path>
                                            <path d="M323.584 512a188.416 188.416 0 1 0 376.832 0 188.416 188.416 0 1 0-376.832 0Z" fill="#4E63DD" opacity=".5" p-id="3641"></path>
                                            <path
                                                d="M512 374.784c36.864 0 71.168 14.336 97.28 40.448s40.448 60.416 40.448 97.28c0 75.776-61.44 137.216-137.216 137.216-36.864 0-71.168-14.336-97.28-40.448s-40.448-60.416-40.448-97.28c0-75.776 61.44-137.216 137.216-137.216m0-51.2c-103.936 0-188.416 84.48-188.416 188.416s84.48 188.416 188.416 188.416 188.416-84.48 188.416-188.416-84.48-188.416-188.416-188.416z"
                                                fill="#4E63DD"
                                                p-id="3642"
                                            ></path>
                                        </svg>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="input-box" :style="{ height: boxHeight + 'px' }">
            <form @submit.prevent="handleSubmit">
                <textarea class="input-textarea" ref="textarea" @input="handleInput" @keydown="handleKeydown" v-model="userInput" :placeholder="placeholder"></textarea>
                <div class="input-box-bottom">
                    <button
                        v-if="(model === 'deepseek' || model === 'deepThinking') && showMode"
                        class="think inline-flex items-center cursor-pointer px-2 py-1 rounded-full transition-colors"
                        :class="isDeepThinking ? 'bg-[#DBEAFE] border-[#4D6BFE] text-[#4D6BFE]' : 'bg-gray-200 border-gray-400 text-gray-600'"
                        @click="toggleDeepThinking"
                    >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298.43-.3.301-.436.774-.428 1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width=".1"
                            ></path>
                            <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
                        </svg>
                        <span class="pl-1" style="font-size: 12px">深度思考</span>
                    </button>

                    <button
                        v-if="(model === 'gpt35' || model === 'gemini' || model === 'kimi' || model === 'stepfunChat' || model === 'lingyiwanwu') && showMode"
                        class="think inline-flex items-center cursor-pointer px-2 py-1 rounded-full transition-colors"
                        :class="think ? 'bg-[#DBEAFE] border-[#4D6BFE] text-[#4D6BFE]' : 'bg-gray-200 border-gray-400 text-gray-600'"
                        @click="changeThink"
                    >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.656 17.344c-1.016-1.015-1.15-2.75-.313-4.925.325-.825.73-1.617 1.205-2.365L3.582 10l-.033-.054c-.5-.799-.91-1.596-1.206-2.365-.836-2.175-.703-3.91.313-4.926.56-.56 1.364-.86 2.335-.86 1.425 0 3.168.636 4.957 1.756l.053.034.053-.034c1.79-1.12 3.532-1.757 4.957-1.757.972 0 1.776.3 2.335.86 1.014 1.015 1.148 2.752.312 4.926a13.892 13.892 0 0 1-1.206 2.365l-.034.054.034.053c.5.8.91 1.596 1.205 2.365.837 2.175.704 3.911-.311 4.926-.56.56-1.364.861-2.335.861-1.425 0-3.168-.637-4.957-1.757L10 16.415l-.053.033c-1.79 1.12-3.532 1.757-4.957 1.757-.972 0-1.776-.3-2.335-.86zm13.631-4.399c-.187-.488-.429-.988-.71-1.492l-.075-.132-.092.12a22.075 22.075 0 0 1-3.968 3.968l-.12.093.132.074c1.308.734 2.559 1.162 3.556 1.162.563 0 1.006-.138 1.298-.43.3-.3.436-.774.428-1.346-.008-.575-.159-1.264-.449-2.017zm-6.345 1.65l.058.042.058-.042a19.881 19.881 0 0 0 4.551-4.537l.043-.058-.043-.058a20.123 20.123 0 0 0-2.093-2.458 19.732 19.732 0 0 0-2.458-2.08L10 5.364l-.058.042A19.883 19.883 0 0 0 5.39 9.942L5.348 10l.042.059c.631.874 1.332 1.695 2.094 2.457a19.74 19.74 0 0 0 2.458 2.08zm6.366-10.902c-.293-.293-.736-.431-1.298-.431-.998 0-2.248.429-3.556 1.163l-.132.074.12.092a21.938 21.938 0 0 1 3.968 3.968l.092.12.074-.132c.282-.504.524-1.004.711-1.492.29-.753.442-1.442.45-2.017.007-.572-.129-1.045-.429-1.345zM3.712 7.055c.202.514.44 1.013.712 1.493l.074.13.092-.119a21.94 21.94 0 0 1 3.968-3.968l.12-.092-.132-.074C7.238 3.69 5.987 3.262 4.99 3.262c-.563 0-1.006.138-1.298.43-.3.301-.436.774-.428 1.346.007.575.159 1.264.448 2.017zm0 5.89c-.29.753-.44 1.442-.448 2.017-.008.572.127 1.045.428 1.345.293.293.736.431 1.298.431.997 0 2.247-.428 3.556-1.162l.131-.074-.12-.093a21.94 21.94 0 0 1-3.967-3.968l-.093-.12-.074.132a11.712 11.712 0 0 0-.71 1.492z"
                                fill="currentColor"
                                stroke="currentColor"
                                stroke-width=".1"
                            ></path>
                            <path d="M10.706 11.704A1.843 1.843 0 0 1 8.155 10a1.845 1.845 0 1 1 2.551 1.704z" fill="currentColor" stroke="currentColor" stroke-width=".2"></path>
                        </svg>
                        <span class="pl-1" style="font-size: 12px">伪深度思考</span>
                    </button>
                    <button type="submit" class="send-button">
                        <svg v-if="!isThinking" width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z"
                                fill="currentColor"
                            ></path>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z"
                                fill="currentColor"
                            ></path>
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        <svg
                            v-else
                            @click="stopAIResponse"
                            t="1740452364359"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="4320"
                            width="32"
                            height="32"
                        >
                            <path d="M882.789 882.789H141.21V141.21H882.79z" fill="#ffffff" p-id="4321"></path>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { autoResizeTextarea, resetTextareaHeight } from '../../utils/helpers'
import { showModels } from '../../utils/api'

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
            models: showModels,
            boxHeight: 100, // 初始高度
            initialHeight: 100, // 初始化高度，用于重置
            placeholder: '来说点什么...',
            userInput: '',
            isDeepThinking: false, // 深度思考开关状态
            showPasswordModal: false, // 控制密码模态框的显示与隐藏
            passwordInput: '', // 用户输入的密码
            correctPassword: '1313ljjmtdsxxx', // 正确的密码
            think: false,
            isShareDialogOpen: false,
            selectedModel: 'DeepSeek-R1',
            selectedModelImg: require('@/assets/deepseek.png')
        }
    },
    methods: {
        handleInput(event) {
            autoResizeTextarea(event.target)
            this.adjustHeight()
        },
        adjustHeight() {
            const textarea = this.$refs.textarea
            textarea.style.height = 'auto' // 重置高度，以便计算新的高度
            textarea.style.height = textarea.scrollHeight + 'px' // 设置新的高度
            this.boxHeight = textarea.scrollHeight + 55 // 40 是 padding 和 margin 的额外高度
        },
        resetInput() {
            // 清空内容
            this.userInput = ''

            // 重置 textarea 高度
            const textarea = this.$refs.textarea
            textarea.style.height = 'auto' // 重置高度
            textarea.style.height = this.initialHeight + 'px' // 设置为初始高度

            // 重置外部 div 高度
            this.boxHeight = this.initialHeight
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
            this.resetInput()
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
        },
        changeThink() {
            if (this.think) {
                this.think = false
                this.$emit('change-mode', 'normal')
            } else {
                this.think = true
                this.$emit('change-mode', 'think')
            }
        },
        init() {
            this.think = false
        },
        openModelDialog() {
            this.isShareDialogOpen = true
        },
        changeModel(data) {
            this.isShareDialogOpen = false
            this.selectedModel = data.name
            this.selectedModelImg = data.img
            this.$emit('change-model', data.model)
        },
        stopAIResponse() {
            this.$emit('stop-ai-response')
        }
    },
    mounted() {}
}
</script>
<style scoped>
.input-box {
    width: calc(100% - 10px);
    min-height: 110px;
    max-height: 500px;
    background-color: #ffffff;
    border: 1px solid #666666;
    border-radius: 10px;
    margin: 5px 5px 25px 5px;
    padding: 10px;
    position: relative;
    overflow: hidden; /* 防止内容溢出 */
}
/* 检测电脑屏幕 */
@media screen and (min-width: 1024px) {
    .input-box {
        min-height: 120px;
    }
}

.input-textarea {
    width: 100%;
    height: auto;
    outline: none;
    border: none;
    resize: none;
    font-size: 14px;
    background-color: #ffffff;
    overflow: hidden; /* 防止内容溢出 */
}

.input-box-bottom {
    position: absolute;
    bottom: 0px;
    width: 100%;
}

.input-box-bottom .send-button {
    position: absolute;
    bottom: 7px;
    right: 20px;
}
.input-box-bottom .think {
    position: absolute;
    bottom: 7px;
    left: -2px;
}
.send-button {
    position: absolute;
    bottom: 10px;
    right: 20px;
    width: 28px; /* 圆形按钮的宽度 */
    height: 28px; /* 圆形按钮的高度 */
    border-radius: 50%; /* 圆形 */
    background-color: #4d6bfe; /* 背景颜色 */
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0; /* 移除默认 padding */
}

.send-button svg {
    width: 14px;
    height: 16px;
    color: white;
}

.send-button:disabled {
    background-color: #ccc; /* 禁用时的背景颜色 */
    cursor: not-allowed;
}
</style>
