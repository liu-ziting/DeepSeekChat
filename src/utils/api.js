// 不同模型的 API 配置
export const API_CONFIG = {
    shuinifengxin: {
        // name: '水泥封心',
        // apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        // apiKey: process.env.VUE_APP_QIUNIUYUN_API_KEY,
        // modelName: 'deepseek-v3',
        // temperature: 0.6
        // name: '水泥封心',
        // apiUrl: 'https://api.ppinfra.com/v3/openai/chat/completions',
        // apiKey: process.env.VUE_APP_OPSLY_API_KEY,
        // modelName: 'deepseek/deepseek-v3/community',
        // temperature: 0.6
        name: '水泥封心',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.VUE_APP_OPENROUTER_API_KEY,
        modelName: 'deepseek/deepseek-chat:free',
        temperature: 0.6
    },
    deepseek: {
        // 派欧算力云
        // name: 'DeepSeek',
        // apiUrl: 'https://api.ppinfra.com/v3/openai/chat/completions',
        // apiKey: process.env.VUE_APP_OPSLY_API_KEY,
        // modelName: 'deepseek/deepseek-v3/community',
        // temperature: 0.6
        // 七牛云
        name: 'DeepSeek',
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_QIUNIUYUN_API_KEY,
        modelName: 'deepseek-v3',
        temperature: 0.6
        // 官方
        // name: 'DeepSeek',
        // apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        // apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY,
        // modelName: 'deepseek-chat',
        // temperature: 0.8
    },
    // 深度思考
    deepThinking: {
        // 派欧算力云
        // name: 'DeepSeek-R1',
        // apiUrl: 'https://api.ppinfra.com/v3/openai/chat/completions',
        // apiKey: '',
        // modelName: 'deepseek/deepseek-r1',
        // temperature: 0.6
        // 七牛云
        name: 'DeepSeek-R1',
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_QIUNIUYUN_API_KEY,
        modelName: 'deepseek-r1',
        temperature: 0.6
        // 官方
        // apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        // apiKey: process.env.VUE_APP_DEEPSEEK_API_KEY,
        // modelName: 'deepseek-reasoner'
    },
    gemini: {
        name: 'Gemini',
        apiUrl: 'https://liuziting-gemini-play-98-58acmhtr50hp.deno.dev/v1/chat/completions',
        // apiUrl: 'https://my-openai-gemini-demo.vercel.app/v1/chat/completions',
        apiKey: process.env.VUE_APP_GEMINI_API_KEY,
        // modelName: 'gemini-2.0-flash-exp',
        modelName: 'gemini-1.5-pro-latest',
        // modelName: 'gemini-2.0-flash-lite-preview-02-05',
        // modelName: 'gemini-2.0-flash-thinking-exp',
        temperature: 0.8
    },
    bigmodel: {
        name: '智谱清言',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: process.env.VUE_APP_GLM_API_KEY,
        modelName: 'glm-4v-flash',
        temperature: 0.8
    },
    bigmodelCogview: {
        name: '智谱清言',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
        apiKey: process.env.VUE_APP_GLM_API_KEY,
        modelName: 'cogview-3-flash',
        temperature: 0.8
    },
    bigmodelCogVideo: {
        name: '智谱清言',
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
        apiKey: process.env.VUE_APP_GLM_API_KEY,
        modelName: 'cogvideox-flash',
        temperature: 0.8
    },
    kimi: {
        name: '月之暗面',
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
    baichuan: {
        name: '百川智能',
        apiUrl: 'https://api.baichuan-ai.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_BAICHUAN_API_KEY,
        modelName: 'Baichuan4-Air',
        temperature: 0.8
    },
    stepfunChat: {
        name: '阶跃星辰',
        apiUrl: 'https://api.stepfun.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_STEPFUN_API_KEY,
        modelName: 'step-1-flash',
        temperature: 0.8
    },
    stepfun: {
        name: '阶跃星辰',
        apiUrl: 'https://api.stepfun.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_STEPFUN_API_KEY,
        modelName: 'step-1o-turbo-vision',
        temperature: 0.8
    },
    stepfunTTS: {
        name: '阶跃星辰',
        apiUrl: 'https://api.stepfun.com/v1/audio/speech',
        apiKey: process.env.VUE_APP_STEPFUN_API_KEY,
        modelName: 'step-tts-mini'
    },
    gpt35: {
        name: 'GPT3.5',
        apiUrl: 'https://api.chatanywhere.tech/v1/chat/completions',
        apiKey: process.env.VUE_APP_GPT35_API_KEY,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.8
    },
    lingyiwanwu: {
        name: '零一万物',
        apiUrl: 'https://api.lingyiwanwu.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_LYWW_API_KEY,
        modelName: 'yi-lightning',
        temperature: 0.8
    },
    qwen: {
        name: '通义千问-Max',
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_QIUNIUYUN_API_KEY,
        modelName: 'qwen-max-2025-01-25',
        temperature: 0.8
    },
    minimax: {
        name: 'MINIMAX',
        apiUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
        apiKey: process.env.VUE_APP_MINIMAX_API_KEY,
        modelName: 'MiniMax-Text-01',
        temperature: 0.1
    },
    gpt4o: {
        name: 'GPT4o',
        apiUrl: 'https://www.mnapi.com/v1/chat/completions',
        apiKey: process.env.VUE_APP_GPT4o_API_KEY,
        modelName: 'gpt-4o',
        temperature: 0.3
    },
    qwq: {
        name: '通义千问-QwQ',
        apiUrl: 'https://api.suanli.cn/v1/chat/completions',
        apiKey: process.env.VUE_APP_QWQ_API_KEY,
        modelName: 'free:QwQ-32B',
        temperature: 0.6
    },
    llama: {
        name: 'Llama',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.VUE_APP_OPENROUTER_API_KEY,
        modelName: 'meta-llama/llama-3.3-70b-instruct:free',
        temperature: 0.6
    },
    gemma: {
        name: 'Gemma',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.VUE_APP_OPENROUTER_API_KEY,
        modelName: 'google/gemma-3-27b-it:free',
        temperature: 0.6
    },
    mistral: {
        name: 'Mistral ',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.VUE_APP_OPENROUTER_API_KEY,
        modelName: 'mistralai/mistral-small-24b-instruct-2501:free',
        temperature: 0.6
    }
}

// 展示不同的模型
export const showModels = [
    // {
    //     name: '水泥封心',
    //     model: 'shuinifengxin',
    //     img: require('@/assets/robot.png')
    // },
    {
        name: 'DeepSeek-R1',
        model: 'deepseek',
        img: require('@/assets/deepseek.png')
    },
    {
        name: '月之暗面',
        model: 'kimi',
        img: require('@/assets/kimi.png')
    },
    {
        name: '智谱清言',
        model: 'bigmodel',
        img: require('@/assets/zhipu.png')
    },
    {
        name: '阶跃星辰',
        model: 'stepfunChat',
        img: require('@/assets/stepfunChat.png')
    },
    {
        name: '通义千问-Max',
        model: 'qwen',
        img: require('@/assets/qwen.jpg')
    },
    {
        name: '通义千问-QwQ',
        model: 'qwq',
        img: require('@/assets/qwen.jpg')
    },
    {
        name: '百川智能',
        model: 'baichuan',
        img: require('@/assets/baishuan.png')
    },
    {
        name: '零一万物',
        model: 'lingyiwanwu',
        img: require('@/assets/lingyiwanwu.svg')
    },
    {
        name: 'GPT3.5',
        model: 'gpt35',
        img: require('@/assets/openai.png')
    },
    {
        name: 'GPT4o',
        model: 'gpt4o',
        img: require('@/assets/gpt4o.png')
    },
    {
        name: 'Gemini',
        model: 'gemini',
        img: require('@/assets/gemini.jpg')
    },
    {
        name: 'Llama',
        model: 'llama',
        img: require('@/assets/llama.png')
    },
    {
        name: 'Gemma',
        model: 'gemma',
        img: require('@/assets/gemma.svg')
    },
    {
        name: 'MiniMax',
        model: 'minimax',
        img: require('@/assets/minimax.webp')
    },
    {
        name: 'Mistral',
        model: 'mistral',
        img: require('@/assets/mistral.png')
    }
]

export const fetchAIResponse = async (apiUrl, apiKey, modelName, messages, temperature = 1, stream = false, onDataReceived, controller) => {
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

    // 记录请求开始时间
    const startTime = performance.now()

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody), // 使用动态构建的请求体
        signal: controller.signal // 关联 AbortController
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 如果 stream 为 false，直接返回完整的响应数据
    if (!stream) {
        const data = await response.json()
        const endTime = performance.now()
        const totalDuration = parseFloat(((endTime - startTime) / 1000).toFixed(1)) // 计算总耗时，保留 1 位小数
        onDataReceived({ type: 'complete', duration: totalDuration }) // 传递总耗时
        return data
    }

    // 处理流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read()
        if (done) {
            const endTime = performance.now()
            const totalDuration = parseFloat(((endTime - startTime) / 1000).toFixed(1)) // 计算总耗时，保留 1 位小数
            onDataReceived({ type: 'complete', duration: totalDuration }) // 传递总耗时
            break
        }

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
                        const currentDuration = parseFloat(((performance.now() - startTime) / 1000).toFixed(2))

                        if (delta.reasoning_content) {
                            const tokenCount = calculateTokenCount(delta.reasoning_content)
                            onDataReceived({
                                type: 'reasoning',
                                content: delta.reasoning_content,
                                token: tokenCount,
                                duration: currentDuration
                            })
                        }
                        if (delta.content) {
                            const tokenCount = calculateTokenCount(delta.content)
                            onDataReceived({
                                type: 'content',
                                content: delta.content,
                                token: tokenCount,
                                duration: currentDuration
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

// TTS
export const fetchTTS = async (apiUrl, apiKey, modelName, input, voice) => {
    const requestBody = {
        model: modelName,
        voice: voice,
        input: input
    }

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // 获取音频数据
    const blob = await response.blob()
    return blob
}

// 计算 token 数量的函数
const calculateTokenCount = text => {
    const englishChars = text.match(/[a-zA-Z]/g) || []
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const tokenCount = englishChars.length * 0.3 + chineseChars.length * 0.6
    return parseFloat(tokenCount.toFixed(4)) // 保留 4 位小数并转换为数字
}
