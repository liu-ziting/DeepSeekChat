<template>
    <div class="mb-4">
        <div :class="messageClass">
            <div v-if="message.role === 'assistant'" class="w-10 h-10 flex items-center justify-center rounded-full">
                <img class="w-full h-full object-cover rounded-full" v-if="roleImgUrl" :src="roleImgUrl" />
                <IconAI v-else :model="message.model" />
            </div>
            <div class="flex flex-col relative" style="max-width: calc(100% - 50px)">
                <span v-if="message.role === 'assistant' && message.model === 'deepseek' && !name" class="text-sm font-medium mb-1" :class="nameClass">
                    <span v-if="message.model && showName" class="text-sm font-medium mb-1" :class="nameClass">
                        {{ config[message.model].name }}
                    </span>
                    {{ message.mode === 'normal' ? '😊' : message.mode === 'angry' ? '😡' : message.mode === 'rude' ? '🤬' : '' }}
                </span>

                <span v-else-if="message.model && showName" class="text-sm font-medium mb-1" :class="nameClass">
                    {{ config[message.model].name }}
                </span>
                <!-- 可折叠的思维链内容 -->
                <div v-if="message.reasoningContent" class="bg-gray-100 p-3 rounded-lg mb-2 text-sm text-gray-700">
                    <div class="flex items-center justify-between cursor-pointer" @click="toggleReasoning">
                        <span class="font-medium">深度思考（{{ message.reasoningDuration }}秒）</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 transition-transform duration-200"
                            :class="{ 'transform rotate-180': isReasoningExpanded }"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div v-if="isReasoningExpanded" class="mt-2">
                        <pre class="whitespace-pre-wrap">{{ message.reasoningContent }}</pre>
                    </div>
                </div>

                <!-- 最终回答内容 -->
                <div :class="bubbleClass" class="relative group text-sm" @mouseenter="showCopyButton = true" @mouseleave="showCopyButton = false">
                    <!-- 拆分混合内容并分别渲染 -->
                    <div v-for="(part, index) in splitMixedContent(message.content)" :key="index">
                        <!-- 如果是代码，使用 CodeBlock 组件 -->
                        <CodeBlock v-if="part.type === 'code'" :code="part.content" :language="detectLanguage(part.content)" />
                        <!-- 否则解析为 Markdown -->
                        <div v-else v-html="renderMarkdown(escapeHtml(part.content))" class="markdown-content"></div>
                    </div>
                    <!-- 复制按钮 -->
                    <button
                        v-if="showCopyButton"
                        @click="handleCopy"
                        class="absolute -top-2 -right-2 p-[3px] bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        class="preset-item cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 border border-gray-300"
                        @click="handlePresetClick(presets)"
                    >
                        {{ presets }}
                    </p>
                </div>
            </div>
        </div>
        <p class="w-full ml-[52px] text-xs text-gray-500 mt-1" v-if="message.token" style="width: 60%; overflow: hidden">
            <span style="float: left">{{ message.duration }}s</span>
            <span style="background: #888d92; display: block; height: 8px; margin: 4px 8px; width: 1px; float: left"></span>
            <span style="float: left">{{ message.token }}Token</span>
        </p>
    </div>
</template>

<script>
import { marked } from 'marked' // 引入 marked
import { splitMixedContent, isCode } from '../../utils/helpers'
import IconAI from '../IconBox/IconAI.vue'
import CodeBlock from '../CodeBlock.vue' // 引入 CodeBlock 组件

import { API_CONFIG } from '../../utils/api'
export default {
    components: {
        IconAI,
        CodeBlock
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: false
        },
        showName: {
            type: Boolean,
            default: true
        },
        roleImgUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showCopyButton: false, // 控制复制按钮的显示
            isReasoningExpanded: !!this.message.reasoningContent, // 默认展开（如果 reasoningContent 存在）
            config: API_CONFIG
        }
    },
    watch: {
        'message.reasoningContent': {
            handler(newVal) {
                if (newVal) {
                    this.isReasoningExpanded = true // 有内容时自动展开
                }
            },
            immediate: true // 立即触发监听
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
        handleCopy() {
            const content = this.message.content
            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(content)
                    .then(() => {
                        console.log('内容已复制到剪贴板！')
                    })
                    .catch(() => {
                        this.fallbackCopyText(content)
                    })
            } else {
                this.fallbackCopyText(content)
            }
        },
        fallbackCopyText(text) {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
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
        },
        toggleReasoning() {
            this.isReasoningExpanded = !this.isReasoningExpanded
        },
        // 解析 Markdown 内容
        renderMarkdown(content) {
            return marked.parse(content) // 使用 marked 解析 Markdown
        },
        // 检测代码语言
        detectLanguage(content) {
            if (content.startsWith('```')) {
                const language = content.split('\n')[0].replace(/```/, '').trim()
                return language || 'javascript'
            }
            return 'javascript'
        },
        // 拆分混合内容
        splitMixedContent(content) {
            return splitMixedContent(content)
        },
        // HTML 实体编码函数
        escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }

            return text.replace(/[&<>"']/g, function (m) {
                return map[m]
            })
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
