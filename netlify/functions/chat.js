const fetch = require('node-fetch');

// 不同模型的 API 配置
const API_CONFIG = {
    // 聊天模型
    'deepseek-v3': {
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.QIUNIUYUN_API_KEY
    },
    'deepseek/deepseek-v3/community': {
        apiUrl: 'https://api.ppinfra.com/v3/openai/chat/completions',
        apiKey: process.env.OPSLY_API_KEY
    },
    'deepseek-r1': {
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.QIUNIUYUN_API_KEY
    },
    'gemini-1.5-pro-latest': {
        apiUrl: 'https://liuziting-gemini-play-98-58acmhtr50hp.deno.dev/v1/chat/completions',
        apiKey: process.env.GEMINI_API_KEY
    },
    'glm-4v-flash': {
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        apiKey: process.env.GLM_API_KEY
    },
    'moonshot-v1-8k': {
        apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
        apiKey: process.env.KIMI_API_KEY
    },
    'Baichuan4-Air': {
        apiUrl: 'https://api.baichuan-ai.com/v1/chat/completions',
        apiKey: process.env.BAICHUAN_API_KEY
    },
    'step-1-flash': {
        apiUrl: 'https://api.stepfun.com/v1/chat/completions',
        apiKey: process.env.STEPFUN_API_KEY
    },
    'gpt-3.5-turbo': {
        apiUrl: 'https://api.chatanywhere.tech/v1/chat/completions',
        apiKey: process.env.GPT35_API_KEY
    },
    'yi-lightning': {
        apiUrl: 'https://api.lingyiwanwu.com/v1/chat/completions',
        apiKey: process.env.LYWW_API_KEY
    },
    'qwen-max-2025-01-25': {
        apiUrl: 'https://api.qnaigc.com/v1/chat/completions',
        apiKey: process.env.QIUNIUYUN_API_KEY
    },
    'MiniMax-Text-01': {
        apiUrl: 'https://api.minimax.chat/v1/text/chatcompletion_v2',
        apiKey: process.env.MINIMAX_API_KEY
    },
    'gpt-4o': {
        apiUrl: 'https://www.mnapi.com/v1/chat/completions',
        apiKey: process.env.GPT4o_API_KEY
    },
    'free:QwQ-32B': {
        apiUrl: 'https://api.suanli.cn/v1/chat/completions',
        apiKey: process.env.QWQ_API_KEY
    },
    // 图像生成模型
    'cogview-3-flash': {
        apiUrl: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
        apiKey: process.env.GLM_API_KEY
    },
    // 图像识别模型
    'step-1o-turbo-vision': {
        apiUrl: 'https://api.stepfun.com/v1/chat/completions',
        apiKey: process.env.STEPFUN_API_KEY
    },
    // TTS 模型
    'step-tts-mini': {
        apiUrl: 'https://api.stepfun.com/v1/audio/speech',
        apiKey: process.env.STEPFUN_API_KEY
    }
};

exports.handler = async (event) => {
    // 解析请求体
    const { modelName, messages, temperature, stream, prompt, input, voice } = JSON.parse(event.body);

    // 获取对应模型的配置
    const config = API_CONFIG[modelName];
    if (!config) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid model' }) // Stringify the error
        };
    }

    try {
        let requestBody;
        let response;

        // 判断请求类型
        if (messages) {
            // 图片识别请求
            requestBody = {
                model: modelName,
                messages,
                temperature,
                stream
            };
            response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // 如果是流式响应，直接返回流
            if (stream) {
                // **IMPORTANT:  Netlify's streaming support is limited.  Consider handling streaming on the client-side.**
                // This is a simplified example.  You might need to adapt it based on the specific stream format.
                //  A more robust solution would involve using a library like 'node-stream-pipe' to handle the piping.

                //  This example assumes the stream is text-based and can be converted to a string.
                const text = await response.text(); // Read the entire stream into a string.  This defeats the purpose of streaming for large responses.
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    },
                    body: text // Return the stringified stream.
                };


                // **Alternative (Client-Side Streaming):**
                //  1.  Return a regular JSON response with the URL of the streaming endpoint.
                //  2.  On the client-side, use `fetch` with `stream: true` to handle the streaming response.
            } else {
                // 如果是普通响应，返回完整数据
                const data = await response.json();
                return {
                    statusCode: 200,
                    body: JSON.stringify(data) // Stringify the data
                };
            }
        } else if (input && voice) {
            // TTS 请求
            requestBody = {
                model: modelName,
                input,
                voice
            };
            response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // 获取音频数据（二进制）
            const audioBuffer = await response.buffer();

            // 返回 Base64 编码的音频数据
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'audio/mpeg'
                },
                isBase64Encoded: true, // 标记响应体为 Base64 编码
                body: audioBuffer.toString('base64') // 返回 Base64 编码的音频数据
            };
            
        } else {
            // 无效的请求
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request body' }) // Stringify the error
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }) // Stringify the error
        };
    }
};