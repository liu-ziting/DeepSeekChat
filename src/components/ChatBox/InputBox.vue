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
                <label @click="changeMode('rude')" class="inline-block cursor-pointer radio">
                    <input class="hidden peer" type="radio" name="radio" :checked="mode === 'rude'" />
                    <span class="relative text-sm transition-all duration-300 peer-checked:font-bold peer-checked:text-black text-gray-400">
                        <span :class="{ 'filter grayscale': mode !== 'rude' }">🤬</span>
                        祖安模式
                    </span>
                </label>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="flex gap-2 items-end">
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
            selectedModel: 'model1' // 默认选择的模型
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
        }
    }
}
</script>
