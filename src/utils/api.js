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
        temperature: 0.8
    },
    kimi: {
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: process.env.VUE_APP_KIMI_API_KEY,
        modelName: 'moonshot-v1-8k',
        temperature: 0.8
    },
    kimiFile: {
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: process.env.VUE_APP_KIMI_API_KEY,
        modelName: 'moonshot-v1-8k-vision-preview',
        temperature: 0.7
    },
    // 深度思考
    deepThinking: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY,
        modelName: 'deepseek-reasoner'
    }
}

// 封装 API 请求
export const fetchAIResponse = async (apiUrl, apiKey, modelName, messages, temperature = 1, stream = false, onDataReceived) => {
    // 构建请求体
    const requestBody = {
        model: modelName,
        messages,
        stream // 根据 stream 参数决定是否启用流式响应
    }

    // 如果不是 deepThinking 模型，添加 temperature 参数
    if (modelName !== 'deepseek-reasoner') {
        requestBody.temperature = temperature
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody) // 使用动态构建的请求体
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 如果 stream 为 false，直接返回完整的响应数据
    if (!stream) {
        const data = await response.json()
        return data
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

        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
            if (line.trim() === 'data: [DONE]') {
                return
            }

            if (line.startsWith('data: ')) {
                const jsonData = line.slice(6)
                try {
                    const data = JSON.parse(jsonData)
                    if (data.choices && data.choices[0].delta) {
                        const delta = data.choices[0].delta

                        // 处理 reasoning_content
                        if (delta.reasoning_content) {
                            onDataReceived({
                                type: 'reasoning',
                                content: delta.reasoning_content
                            })
                        }

                        // 处理最终回答 content
                        if (delta.content) {
                            onDataReceived({
                                type: 'content',
                                content: delta.content
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error)
                }
            }
        }
    }
}
