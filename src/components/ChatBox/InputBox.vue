<template>
    <div class="form fixed bottom-9 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <!-- 模型切换下拉菜单 -->
        <div v-if="model === 'deepseek' && showMode" class="mb-2" style="width: 80%; margin-top: -5px">
            <div>
                <!-- 正常模式 -->
                <label @click="changeMode('normal')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'normal'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'normal' }">😀</span>
                        正常模式
                    </span>
                </label>

                <!-- 暴躁模式 -->
                <label @click="changeMode('angry')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'angry'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'angry' }">😡</span>
                        暴躁模式
                    </span>
                </label>

                <!-- 祖安模式 -->
                <label @click="changeMode('rude')" style="margin-right: 10px" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'rude'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'rude' }">🤬</span>
                        祖安模式
                    </span>
                </label>
            </div>
        </div>
        <div v-if="isDeepThinking" class="mb-3 text-sm text-gray-400 w-80" style="margin-top: -5px">已启用DeepSeek深度思考模式</div>

        <!-- 深度思考开关 -->
        <label
            v-if="(model === 'deepseek' || model === 'deepThinking') && showMode"
            class="inline-flex items-center cursor-pointer"
            style="position: absolute; right: 1rem; top: 10px; float: right"
        >
            <input type="checkbox" class="sr-only peer" v-model="isDeepThinking" @change="toggleDeepThinking" />
            <div
                class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
        </label>

        <form @submit.prevent="handleSubmit" class="flex gap-2 items-end w-full">
            <textarea
                ref="textarea"
                v-model="userInput"
                placeholder="来说点什么..."
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
            userInput: '',
            selectedModel: 'model1', // 默认选择的模型
            isDeepThinking: false // 深度思考开关状态
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
        changeMode(newMode) {
            this.$emit('change-mode', newMode)
        },
        toggleDeepThinking() {
            this.$emit('toggle-deep-thinking', this.isDeepThinking)
        }
    }
}
</script>
