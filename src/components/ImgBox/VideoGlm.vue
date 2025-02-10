<template>
    <div class="container mx-auto p-4">
        <h2 class="head-title text-2xl font-bold text-center mb-6 cursor-pointer transition-all">
          梦的回忆：重温你的梦境
        </h2>
        <div class="flex flex-col lg:flex-row lg:gap-8">
            <!-- 视频展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <video :src="videoUrl" controls class="w-full h-full object-cover" v-if="videoUrl"></video>
                <div class="w-full h-full bg-gray-100 flex items-center justify-center" v-else>
                    <IconGlm />
                </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <textarea
                    v-model="inputText"
                    :disabled="disabled"
                    class="text-sm w-full h-40 p-2 text-lg border rounded-md focus:ring-2 mb-4"
                    placeholder="请输入梦境描述，详细描绘梦中的场景、人物、情感和细节，越具体越能还原出真实的梦境画面！"
                ></textarea>
                <button
                    @click="submitData"
                    class="text-sm w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    :disabled="!inputText || isLoading"
                >
                    {{ isLoading ? '生成中，请不要退出页面！' : '生成视频' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { API_CONFIG } from '../../utils/api'
import IconGlm from '../IconBox/IconGlm.vue'
import { ImageCogView } from '../../utils/prompt.js'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            inputText: '',
            videoUrl: '',
            isLoading: false,
            styles: ImageCogView,
            currentStyles: [],
            disabled:false,
        }
    },
    methods: {
        shuffleStyles() {
            // 随机从styles中选择3个不同的风格
            const shuffled = this.styles.sort(() => Math.random() - 0.5).slice(0, 4)
            this.currentStyles = shuffled
        },
        async submitData() {
            if (!this.inputText) return

            // 第一步：调用大模型优化用户输入
            const optimizedPrompt = await this.optimizePrompt(this.inputText)
            if (!optimizedPrompt) return
            this.inputText = optimizedPrompt

            // 第二步：生成视频
            const { apiUrl, apiKey, modelName } = API_CONFIG['bigmodelCogVideo']
            const stylePrompt = this.styles.find(style => style.name === this.selectedStyle)?.prompt || ''
            const fullPrompt = `${optimizedPrompt}，${stylePrompt}`

            // 生成视频并轮询任务状态
            const taskId = await this.generateVideo(apiUrl, apiKey, modelName, fullPrompt)
            if (taskId) {
                await this.pollTaskStatus(taskId)
            }
        },
        async optimizePrompt(userInput) {
            this.isLoading = true
            try {
                const { apiUrl, apiKey, modelName } = API_CONFIG['bigmodel']
                const requestBody = {
                    model: modelName,
                    stream: false,
                    temperature: 0.8,
                    messages: [
                        { "role": "system", "content": "请将以下用户描述优化为适合生成视频的详细提示词，不超过200字：" },
                        { "role": "user", "content": `${userInput}` }
                    ],
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
            this.isLoading = true
            this.videoUrl = null
            try {
                const requestBody = {
                    model: modelName,
                    prompt,
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
            const {  apiKey } = API_CONFIG['bigmodelCogVideo']
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
                        this.videoUrl = result.video_result[0]?.url // 假设返回的视频 URL 字段为 video_result[0].url
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
    mounted() {
        // 初始化时先加载3个风格
        this.shuffleStyles()
    }
}
</script>

<style>
textarea {
    outline: none;
}
</style>
