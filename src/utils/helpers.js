// 判断是否为代码
export const isCode = content => {
    if (!content || typeof content !== 'string') return false
    return content.includes('\n') || content.includes('function') || content.includes('class')
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
