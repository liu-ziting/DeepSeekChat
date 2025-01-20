<template>
    <div class="mb-4">
        <div :class="messageClass">
            <div v-if="message.role === 'assistant'" class="w-10 h-10 flex items-center justify-center rounded-full">
                <IconAI />
            </div>

            <div class="flex flex-col relative" style="max-width: calc(100% - 50px)">
                <span v-if="message.role === 'assistant' && message.model === 'deepseek' && !name" class="text-sm font-medium mb-1" :class="nameClass">
                    {{ message.mode === 'normal' ? '😀' : message.mode === 'angry' ? '😡' : '🤬' }}
                </span>
                <!-- <span v-if="name && message.role === 'assistant'" class="text-sm font-medium mb-1" :class="nameClass">{{ name }}</span> -->

                <!-- 内容区域 -->
                <div :class="bubbleClass" class="relative group" @mouseenter="showCopyButton = true" @mouseleave="showCopyButton = false">
                    <pre v-if="isCode(message.content)" class="whitespace-pre-wrap rounded-lg"><code>{{ message.content }}</code></pre>
                    <span v-else>{{ message.content }}</span>

                    <!-- 复制按钮 -->
                    <button
                        v-if="showCopyButton"
                        @click="handleCopy"
                        class="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                </div>

                <div>
                    <p
                        v-for="(presets, index) in message.presets"
                        :key="index"
                        style="width: auto"
                        class="preset-item cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 border border-gray-300"
                        @click="handlePresetClick(presets)"
                    >
                        {{ presets }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { isCode } from '../../utils/helpers'
import IconAI from '../IconBox/IconAI.vue'

export default {
    components: {
        IconAI
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            showCopyButton: false // 控制复制按钮的显示
        }
    },
    computed: {
        messageClass() {
            return this.message.role === 'user' ? 'flex justify-end items-start gap-3' : 'flex justify-start items-start gap-3'
        },
        bubbleClass() {
            return this.message.role === 'user' ? 'bg-blue-500 text-white rounded-lg p-3 ' : 'bg-gray-200 text-gray-800 rounded-lg p-3 '
        },
        nameClass() {
            return this.message.role === 'user' ? 'text-right text-blue-500' : 'text-left text-gray-600'
        }
    },
    methods: {
        isCode,
        handlePresetClick(preset) {
            this.$emit('preset-click', preset)
        },
        // 复制内容
        handleCopy() {
            const content = this.message.content
            if (navigator.clipboard) {
                // 使用现代 Clipboard API
                navigator.clipboard
                    .writeText(content)
                    .then(() => {
                        alert('内容已复制到剪贴板！')
                    })
                    .catch(() => {
                        this.fallbackCopyText(content) // 如果 Clipboard API 失败，使用降级方案
                    })
            } else {
                // 使用降级方案
                this.fallbackCopyText(content)
            }
        },
        // 降级复制方案
        fallbackCopyText(text) {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed' // 避免滚动到底部
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                const successful = document.execCommand('copy')
                if (successful) {
                    console.log('内容已复制到剪贴板！')
                } else {
                    console.log('复制失败，请手动复制。')
                }
            } catch (err) {
                console.log('复制失败，请手动复制。')
            }

            document.body.removeChild(textArea)
        }
    }
}
</script>

<style scoped>
.preset-item {
    margin: 4px 0;
    color: #4a5568; /* 预设文本颜色 */
    font-size: 0.875rem; /* 预设文本大小 */
    border: 1px solid #e2e8f0; /* 边框颜色 */
}

.preset-item:hover {
    background-color: #f7fafc; /* 悬停背景色 */
    border-color: #cbd5e0; /* 悬停时边框颜色加深 */
}
</style>
