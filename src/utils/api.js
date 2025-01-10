// 不同模型的 API 配置
export const API_CONFIG = {
    deepseek: {
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY,
        modelName: 'deepseek-chat'
    },
    gemini: {
        apiUrl: 'https://liuziting-gemini-play-98-58acmhtr50hp.deno.dev/v1/chat/completions',
        apiKey: process.env.VUE_APP_GEMINI_API_KEY,
        modelName: 'gemini-2.0-flash-exp'
    }
}

// 封装 API 请求
export const fetchAIResponse = async (apiUrl, apiKey, modelName, messages, temperature = 1.5) => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: modelName,
            messages,
            temperature
        })
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.json()
}
