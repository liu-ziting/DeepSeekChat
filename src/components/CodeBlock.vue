<template>
    <div class="code-block">
        <!-- 代码块 -->
        <pre><code ref="code" :class="languageClass">{{ formattedCode }}</code></pre>
        <!-- 复制按钮 -->
        <button class="copy-button" @click="copyCode">复制代码</button>
    </div>
</template>

<script>
import hljs from 'highlight.js' // 引入 highlight.js
import 'highlight.js/styles/github.css' // 引入代码高亮样式
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
            hljs.highlightBlock(codeElement)
        },
        // 复制代码
        copyCode() {
            const clipboard = new Clipboard('.copy-button', {
                text: () => this.code
            })

            clipboard.on('success', () => {
                alert('代码已复制！')
                clipboard.destroy() // 销毁 clipboard 实例
            })

            clipboard.on('error', () => {
                alert('复制失败，请手动复制。')
                clipboard.destroy() // 销毁 clipboard 实例
            })
        }
    }
}
</script>

<style scoped>
.code-block {
    position: relative;
    background: #f6f8fa; /* 代码块背景色 */
    border-radius: 6px;
    padding: 16px;
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

.copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    background: #0366d6; /* 按钮背景色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.copy-button:hover {
    background: #0356b6; /* 按钮悬停背景色 */
}
</style>
