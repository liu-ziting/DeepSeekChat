vue
<template>
    <div class="code-block">
        <!-- 代码块 -->
        <pre><code ref="code" :class="languageClass">{{ formattedCode }}</code></pre>
        <!-- 复制按钮 -->
        <svg
            v-if="!isCopied"
            @click="copyCode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500 absolute top-2 right-2 cursor-pointer copy-button"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
        <!-- 成功图标 -->
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-green-500 absolute top-2 right-2 cursor-pointer copy-button"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
    </div>
</template>
<script>
import hljs from 'highlight.js' // 引入 highlight.js
import 'highlight.js/styles/atom-one-dark.css' // 引入黑色主题样式
import Clipboard from 'clipboard' // 引入 clipboard 库
export default {
    props: {
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            default: 'plaintext' // 默认语言为纯文本
        },
        showCopyButton: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isCopied: false // 控制是否显示成功图标
        }
    },
    computed: {
        // 根据语言动态设置高亮类
        languageClass() {
            return `language-${this.language}`
        },
        // 保留换行符的代码
        formattedCode() {
            return this.code // 直接返回代码内容，确保换行符被保留
        }
    },
    mounted() {
        // 初始化代码高亮
        this.highlightCode()
    },
    methods: {
        // 高亮代码
        highlightCode() {
            const codeElement = this.$refs.code
            if (codeElement) {
                hljs.highlightBlock(codeElement)
            }
        },
        // 复制代码
        copyCode() {
            const clipboard = new Clipboard('.copy-button', {
                text: () => this.code
            })
            clipboard.on('success', () => {
                this.isCopied = true // 显示成功图标
                setTimeout(() => {
                    this.isCopied = false // 3 秒后恢复为复制图标
                }, 3000)
                clipboard.destroy() // 销毁 clipboard 实例
            })
            clipboard.on('error', () => {
                console.log('复制失败，请手动复制。')
                clipboard.destroy() // 销毁 clipboard 实例
            })
        }
    }
}
</script>
<style scoped>
.code-block {
    position: relative;
    background: #282c34; /* 黑色主题背景色 */
    border-radius: 6px;
    padding: 10px;
    margin: 16px 0;
}
pre {
    margin: 0;
    overflow-x: auto; /* 水平滚动 */
    white-space: pre-wrap; /* 保留换行符 */
    word-wrap: break-word; /* 长单词换行 */
}
code {
    display: block; /* 确保代码块独占一行 */
    font-family: 'Courier New', Courier, monospace; /* 等宽字体 */
    font-size: 14px;
    line-height: 1.5;
}
pre code.hljs {
    padding: 0 !important;
}
</style>
