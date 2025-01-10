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
        temperature: 1
    }
}

// 封装 API 请求
export const fetchAIResponse = async (apiUrl, apiKey, modelName, messages, temperature = 1) => {
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
