// 判断是否为代码
// export const isCode = content => {
//     return content.startsWith('```') || /^\s{4}/.test(content)
//     // if (!content || typeof content !== 'string') return false
//     // return content.includes('\n') || content.includes('function') || content.includes('class')
// }
export function isCode(content) {
    // 如果内容包含代码块分隔符（``` 或 ~~~），则认为是代码
    if (/```[\s\S]*```|~~~[\s\S]*~~~/g.test(content)) {
        return true
    }

    // 如果内容包含明显的代码片段（如 HTML、CSS、JavaScript 等），则认为是代码
    const codePatterns = [
        /<[^>]+>/, // HTML 标签
        /{[^}]+}/, // CSS 样式
        /function\s+\w+\(/, // JavaScript 函数
        /console\.log\(/ // JavaScript 日志
    ]

    return codePatterns.some(pattern => pattern.test(content))
}

export function splitMixedContent(content) {
    const parts = []
    const codeBlockRegex = /```([\s\S]*?)```|~~~([\s\S]*?)~~~/g // 匹配代码块
    let lastIndex = 0

    // 查找所有代码块
    content.replace(codeBlockRegex, (match, p1, p2, offset) => {
        // 添加代码块之前的 Markdown 内容
        if (offset > lastIndex) {
            parts.push({
                type: 'markdown',
                content: content.slice(lastIndex, offset)
            })
        }

        // 添加代码块
        const codeContent = p1 || p2
        parts.push({
            type: 'code',
            content: codeContent
        })

        lastIndex = offset + match.length
        return match
    })

    // 添加剩余的 Markdown 内容
    if (lastIndex < content.length) {
        parts.push({
            type: 'markdown',
            content: content.slice(lastIndex)
        })
    }

    return parts
}
// 自动调整输入框高度
export const autoResizeTextarea = textarea => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
}

// 重置输入框高度
export const resetTextareaHeight = textarea => {
    textarea.style.height = 'auto'
}

export const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
