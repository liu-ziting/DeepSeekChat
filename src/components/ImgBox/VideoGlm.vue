<template>
    <div class="container mx-auto pl-4 pr-4">
        <div class="flex flex-col lg:flex-row lg:gap-8 lg:mt-10">
            <!-- 视频展示区域 -->
            <div class="w-full aspect-[4/3] mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <video :src="videoUrl" :poster="coverImageUrl" controls class="w-full h-full object-cover" v-if="videoUrl"></video>
                <div class="w-full h-full bg-gray-100 flex items-center justify-center" v-else>
                    <IconGlm />
                </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                    <div class="relative">
                        <label for="inputText" class="text-sm font-semibold"
                            >AI梦境生成器

                            <a href="javascript:void(0)" class="text-blue-500 cursor-pointer float-right" @click="optimizeInput">优化提示词</a>
                        </label>
                        <textarea
                            v-model="inputText"
                            :disabled="disabled"
                            class="text-sm w-full h-[120px] p-2 text-lg border rounded-md focus:ring-2 mb-4 mt-2"
                            placeholder="请输入梦境描述，详细描绘梦中的场景、人物、情感和细节，越具体越能还原出真实的梦境画面！"
                        ></textarea>
                    </div>
                </div>
                <button
                    @click="submitData"
                    class="text-sm w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    :disabled="!inputText || isLoading"
                >
                    {{ isLoading ? inputTip : '开始创作' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { API_CONFIG } from '../../utils/api'
import IconGlm from '../IconBox/IconGlm.vue'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            inputText: '',
            videoUrl: '',
            coverImageUrl: '',
            isLoading: false,
            disabled: false,
            inputTip: ''
        }
    },
    methods: {
        async optimizeInput() {
            if (!this.inputText) return

            this.isLoading = true
            try {
                this.inputTip = '提示词优化中，请稍后！'
                const optimizedPrompt = await this.optimizePrompt(this.inputText)
                if (optimizedPrompt) {
                    this.inputText = optimizedPrompt
                }
            } catch (error) {
                console.error('Error optimizing prompt:', error)
            } finally {
                this.isLoading = false
            }
        },
        async submitData() {
            if (!this.inputText) return

            // 直接生成视频
            const { apiUrl, apiKey, modelName } = API_CONFIG['bigmodelCogVideo']
            const fullPrompt = `${this.inputText}`

            // 生成视频并轮询任务状态
            const taskId = await this.generateVideo(apiUrl, apiKey, modelName, fullPrompt)
            if (taskId) {
                await this.pollTaskStatus(taskId)
            }
        },
        async optimizePrompt(userInput) {
            try {
                const { apiUrl, apiKey, modelName } = API_CONFIG['bigmodel']
                const requestBody = {
                    model: modelName,
                    stream: false,
                    temperature: 0.8,
                    messages: [
                        {
                            role: 'system',
                            content: `你是一名提示词优化助手，请将用户的白话描述转换为适合生成视频的详细提示词。要求：

1. 保留核心人物、环境、动作及情感细节，准确传达故事主旨；
2. 添加适合视频生成的画面描述，包括光线、色彩、动作、镜头角度、背景和氛围等；
3. 确保简洁明了，突出视频的关键元素，使其不超过 150 字。

### 示例：
**用户描述**：我梦到被一群猫追逐。
**优化后的提示词**："镜头从低处逐渐拉远，拍摄一名人物在昏暗的街道上奔跑（人物描述）。周围是一群猫（主体描述），它们的眼睛在微弱的路灯下闪烁，步伐轻盈且迅速。画面带有轻微的晃动，增强紧张感，猫群的快速移动在镜头前形成模糊的影像。背景色调偏冷，夜晚的空气中弥漫着神秘感，人物的脸上充满恐慌。"
`
                        },
                        { role: 'user', content: `${userInput}` }
                    ]
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

                const result = await response.json()
                return result.choices[0].message.content || ''
            } catch (error) {
                console.error('Error optimizing prompt:', error)
                return null
            }
        },
        async generateVideo(apiUrl, apiKey, modelName, prompt) {
            this.inputTip = '生成中，请不要退出页面！'
            this.isLoading = true
            this.videoUrl = null
            try {
                const requestBody = {
                    model: modelName,
                    prompt,
                    with_audio: true
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

                const result = await response.json()

                return result.id // 假设返回的任务 ID 字段为 task_id
            } catch (error) {
                console.error('Error generating video:', error)
                return null
            }
        },
        async pollTaskStatus(taskId) {
            const { apiKey } = API_CONFIG['bigmodelCogVideo']
            const maxAttempts = 30 // 最大轮询次数
            const interval = 5000 // 轮询间隔 5 秒

            for (let i = 0; i < maxAttempts; i++) {
                try {
                    const response = await fetch(`https://open.bigmodel.cn/api/paas/v4/async-result/${taskId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`
                        }
                    })

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }

                    const result = await response.json()
                    if (result.task_status === 'SUCCESS') {
                        this.isLoading = false
                        this.videoUrl = result.video_result[0]?.url
                        this.coverImageUrl = result.video_result[0]?.cover_image_url
                        return
                    } else if (result.status === 'failed') {
                        throw new Error('Video generation failed')
                    }
                } catch (error) {
                    console.error('Error polling task status:', error)
                    return
                }

                await new Promise(resolve => setTimeout(resolve, interval))
            }

            console.error('Task polling timed out')
        }
    },
    mounted() {}
}
</script>

<style scoped>
.container {
    padding-bottom: 50px;
}
textarea {
    outline: none;
}
.head-title {
    font-size: 18px;
    margin-bottom: 10px;
}
</style>
