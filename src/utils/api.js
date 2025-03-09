// 不同模型的配置，具体配置和API请求在 ：netlify\functions\chat.js
export const modelConfig = {
    shuinifengxin: {
        name: '水泥封心',
        modelName: 'deepseek-v3', 
        temperature: 0.6
    },
    deepseek: {
        name: 'DeepSeek',
        modelName: 'deepseek/deepseek-v3/community', 
        temperature: 0.6
    },
    deepThinking: {
        name: 'DeepSeek-R1',
        modelName: 'deepseek-r1', 
        temperature: 0.6
    },
    gemini: {
        name: 'Gemini',
        modelName: 'gemini-1.5-pro-latest', 
        temperature: 0.8
    },
    bigmodel: {
        name: '智谱清言',
        modelName: 'glm-4v-flash', 
        temperature: 0.8
    },
    bigmodelCogview: {
        name: '智谱清言',
        modelName: 'cogview-3-flash', 
        temperature: 0.8
    },
    bigmodelCogVideo: {
        name: '智谱清言',
        modelName: 'cogvideox-flash', 
        temperature: 0.8
    },
    kimi: {
        name: '月之暗面',
        modelName: 'moonshot-v1-8k', 
        temperature: 0.8
    },
    kimiFile: {
        name: '月之暗面',
        modelName: 'moonshot-v1-8k-vision-preview', 
        temperature: 0.7
    },
    baichuan: {
        name: '百川智能',
        modelName: 'Baichuan4-Air', 
        temperature: 0.8
    },
    stepfunChat: {
        name: '阶跃星辰',
        modelName: 'step-1-flash', 
        temperature: 0.8
    },
    stepfun: {
        name: '阶跃星辰',
        modelName: 'step-1o-turbo-vision', 
        temperature: 0.8
    },
    stepfunTTS: {
        name: '阶跃星辰',
        modelName: 'step-tts-mini', 
    },
    gpt35: {
        name: 'GPT3.5',
        modelName: 'gpt-3.5-turbo', 
        temperature: 0.8
    },
    lingyiwanwu: {
        name: '零一万物',
        modelName: 'yi-lightning', 
        temperature: 0.8
    },
    qwen: {
        name: '通义千问-Max',
        modelName: 'qwen-max-2025-01-25', 
        temperature: 0.8
    },
    minimax: {
        name: 'MINIMAX',
        modelName: 'MiniMax-Text-01', 
        temperature: 0.1
    },
    gpt4o: {
        name: 'GPT4o',
        modelName: 'gpt-4o', 
        temperature: 0.3
    },
    qwq: {
        name: '通义千问-QwQ',
        modelName: 'free:QwQ-32B', 
        temperature: 0.6
    }
};

// 展示不同的模型
export const showModels = [
    {
        name: '水泥封心',
        model: 'shuinifengxin',
        img: require('@/assets/robot.png')
    },
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
        name: '阶跃星辰',
        model: 'stepfunChat',
        img: require('@/assets/stepfunChat.png')
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
        name: 'MiniMax',
        model: 'minimax',
        img: require('@/assets/minimax.webp')
    }
]

export const fetchAIResponse = async (modelName, messages, temperature = 1, stream = false, onDataReceived, controller) => {
    // 记录请求开始时间
    const startTime = performance.now();

    // 调用 Netlify Function
    const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            modelName,
            messages,
            temperature,
            stream
        }),
        signal: controller?.signal // 关联 AbortController
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // 如果 stream 为 false，直接返回完整的响应数据
    if (!stream) {
        const data = await response.json();
        const endTime = performance.now();
        const totalDuration = parseFloat(((endTime - startTime) / 1000).toFixed(1)); // 计算总耗时，保留 1 位小数
        onDataReceived({ type: 'complete', duration: totalDuration }); // 传递总耗时
        return data;
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            const endTime = performance.now();
            const totalDuration = parseFloat(((endTime - startTime) / 1000).toFixed(1)); // 计算总耗时，保留 1 位小数
            onDataReceived({ type: 'complete', duration: totalDuration }); // 传递总耗时
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
            if (line.trim() === 'data: [DONE]') {
                return;
            }

            if (line.startsWith('data: ')) {
                const jsonData = line.slice(6);
                try {
                    const data = JSON.parse(jsonData);
                    if (data.choices && data.choices[0].delta) {
                        const delta = data.choices[0].delta;
                        const currentDuration = parseFloat(((performance.now() - startTime) / 1000).toFixed(2));

                        if (delta.reasoning_content) {
                            const tokenCount = calculateTokenCount(delta.reasoning_content);
                            onDataReceived({
                                type: 'reasoning',
                                content: delta.reasoning_content,
                                token: tokenCount,
                                duration: currentDuration
                            });
                        }
                        if (delta.content) {
                            const tokenCount = calculateTokenCount(delta.content);
                            onDataReceived({
                                type: 'content',
                                content: delta.content,
                                token: tokenCount,
                                duration: currentDuration
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        }
    }
};


// 计算 token 数量的函数
const calculateTokenCount = text => {
    const englishChars = text.match(/[a-zA-Z]/g) || []
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const tokenCount = englishChars.length * 0.3 + chineseChars.length * 0.6
    return parseFloat(tokenCount.toFixed(4)) // 保留 4 位小数并转换为数字
}
