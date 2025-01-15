// 不同模型的 API 配置
export const API_CONFIG = {
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY,
        modelName: 'deepseek-chat',
        temperature: 1.5
    },
    gemini: {
        apiUrl: 'https://liuziting-gemini-play-98-58acmhtr50hp.deno.dev/v1/chat/completions',
        apiKey: process.env.VUE_APP_GEMINI_API_KEY,
        modelName: 'gemini-2.0-flash-exp',
        temperature: 1
    },
    bigmodel: {
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: process.env.VUE_APP_GLM_API_KEY,
        modelName: 'glm-4v-flash',
        temperature: 1
    },
    kimi: {
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: process.env.VUE_APP_KIMI_API_KEY,
        modelName: 'moonshot-v1-8k',
        temperature: 0.8
    }
}

// 封装 API 请求
export const fetchAIResponse = async (apiUrl, apiKey, modelName, messages, temperature = 1, onDataReceived) => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelName,
            messages,
            temperature,
            stream: true // 启用流式响应
        })
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 处理流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // 处理每一条消息
        const lines = buffer.split('\n')
        buffer = lines.pop() // 最后一行可能不完整，保留在 buffer 中

        for (const line of lines) {
            if (line.trim() === 'data: [DONE]') {
                // 流结束
                return
            }

            if (line.startsWith('data: ')) {
                const jsonData = line.slice(6) // 去掉 'data: ' 前缀
                try {
                    const data = JSON.parse(jsonData)
                    if (data.choices && data.choices[0].delta.content) {
                        // 调用回调函数处理增量数据
                        onDataReceived(data.choices[0].delta.content)
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error)
                }
            }
        }
    }
}
