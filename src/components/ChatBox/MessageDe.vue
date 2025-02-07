<template>
    <div class="mb-4">
        <div :class="messageClass">
            <div v-if="message.role === 'assistant'" class="w-10 h-10 flex items-center justify-center rounded-full">
                <svg
                    style="margin-top: 8px"
                    t="1738893200881"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="7088"
                    width="48"
                    height="48"
                >
                    <path
                        d="M1000.14 205.784c-10.484-5.244-15.012 4.752-21.136 9.828-2.088 1.64-3.868 3.768-5.652 5.736-15.32 16.712-33.216 27.688-56.628 26.376-34.2-1.964-63.404 9.012-89.208 35.72-5.488-32.932-23.716-52.592-51.468-65.208-14.54-6.556-29.204-13.108-39.384-27.36-7.084-10.16-9.008-21.464-12.572-32.608-2.256-6.716-4.508-13.6-12.084-14.744-8.252-1.312-11.468 5.736-14.704 11.632-12.904 24.084-17.92 50.628-17.408 77.496 1.104 60.46 26.132 108.628 75.816 142.872 5.652 3.932 7.108 7.864 5.324 13.6-3.38 11.792-7.432 23.26-10.976 35.06-2.252 7.536-5.632 9.172-13.56 5.896-27.256-11.632-50.808-28.836-71.636-49.64-35.328-34.9-67.28-73.404-107.112-103.552a473.012 473.012 0 0 0-28.404-19.824c-40.656-40.304 5.324-73.4 15.972-77.332 11.12-4.096 3.872-18.184-32.112-18.02-35.984 0.16-68.896 12.452-110.836 28.836-6.144 2.456-12.6 4.256-19.192 5.732-38.092-7.372-77.62-9.012-118.928-4.26-77.76 8.848-139.88 46.368-185.548 110.428C23.86 379.456 10.936 466.944 26.768 558.204c16.588 96.172 64.696 175.8 138.588 238.06 76.636 64.552 164.884 96.172 265.564 90.112 61.152-3.604 129.228-11.96 206.028-78.316 19.376 9.828 39.712 13.764 73.42 16.712 25.992 2.456 50.996-1.312 70.348-5.408 30.332-6.552 28.224-35.224 17.268-40.468-88.904-42.272-69.388-25.068-87.124-38.992 45.18-54.56 113.256-111.248 139.88-294.912 2.108-14.584 0.328-23.76 0-35.556-0.164-7.208 1.432-9.992 9.524-10.812 22.26-2.624 43.888-8.848 63.732-19.988 57.588-32.116 80.836-84.872 86.324-148.112 0.82-9.668-0.164-19.664-10.18-24.74zM498.196 774.96c-86.14-69.14-127.94-91.916-145.2-90.932-16.14 0.984-13.232 19.824-9.688 32.112 3.704 12.124 8.56 20.48 15.336 31.132 4.672 7.044 7.908 17.528-4.688 25.396-27.752 17.528-75.98-5.9-78.236-7.048-56.156-33.752-103.116-78.316-136.188-139.264-31.952-58.652-50.484-121.568-53.56-188.744-0.816-16.22 3.872-21.952 19.664-24.904a189.16 189.16 0 0 1 63.1-1.636c87.94 13.108 162.816 53.248 225.564 116.816 35.82 36.208 62.916 79.464 90.852 121.736 29.676 44.892 61.624 87.652 102.276 122.716 14.356 12.288 25.804 21.624 36.78 28.508-33.072 3.768-88.268 4.588-126.012-25.888z m41.308-271.156c0-7.208 5.652-12.944 12.76-12.944 1.612 0.028 3.056 0.3 4.34 0.82a12.788 12.788 0 0 1 7.688 8.28c0.38 1.252 0.56 2.532 0.548 3.844a12.92 12.92 0 0 1-2.088 7.168 12.868 12.868 0 0 1-5.736 4.776 12.8 12.8 0 0 1-4.916 1 12.736 12.736 0 0 1-4.896-1 12.76 12.76 0 0 1-5.688-4.788 12.672 12.672 0 0 1-2.012-7.156z m128.268 67.176c-8.212 3.44-16.448 6.388-24.372 6.716-12.248 0.656-25.64-4.424-32.892-10.648-11.304-9.668-19.372-15.076-22.752-31.948-1.456-7.212-0.656-18.352 0.636-24.74 2.908-13.764-0.328-22.612-9.832-30.64-7.74-6.552-17.592-8.356-28.404-8.356-4.036 0-7.744-1.8-10.488-3.276a10.58 10.58 0 0 1-3.492-2.672 10.524 10.524 0 0 1-2.136-3.844 10.568 10.568 0 0 1-0.412-4.38 10.512 10.512 0 0 1 1.372-4.176c1.124-2.296 6.612-7.868 7.904-8.848 14.684-8.52 31.62-5.736 47.268 0.656 14.52 6.06 25.476 17.2 41.308 32.932 16.14 19.004 19.048 24.248 28.22 38.5 7.272 11.14 13.888 22.612 18.392 35.716 2.764 8.192-0.8 14.912-10.32 19.008z"
                        fill="#707070"
                        p-id="7089"
                    ></path>
                </svg>
            </div>

            <div class="flex flex-col relative" style="max-width: calc(100% - 50px)">
                <span v-if="message.role === 'assistant'" class="text-sm font-medium mb-1" :class="nameClass">
                    <span v-if="message.model && showName" class="text-sm font-medium mb-1" :class="nameClass"> DeepFuck </span>
                </span>

                <span v-else-if="message.model && showName" class="text-sm font-medium mb-1" :class="nameClass">
                    {{ config[message.model].name }}
                </span>

                <!-- 最终回答内容 -->
                <div :class="bubbleClass" class="relative group" @mouseenter="showCopyButton = true" @mouseleave="showCopyButton = false">
                    <!-- 拆分混合内容并分别渲染 -->
                    <div v-for="(part, index) in splitMixedContent(message.content)" :key="index">
                        <!-- 如果是代码，使用 CodeBlock 组件 -->
                        <CodeBlock v-if="part.type === 'code'" :code="part.content" :language="detectLanguage(part.content)" />
                        <!-- 否则解析为 Markdown -->
                        <div v-else v-html="renderMarkdown(part.content)" class="markdown-content"></div>
                    </div>
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
import CodeBlock from '../CodeBlock.vue' // 引入 CodeBlock 组件
import { API_CONFIG } from '../../utils/api'
export default {
    components: {
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
