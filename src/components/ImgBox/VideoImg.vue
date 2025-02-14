<template>
    <div class="container mx-auto pl-4 pr-4">
        <!-- 选项卡切换 -->

        <div class="flex flex-col lg:flex-row lg:gap-8 lg:mt-10">
            <!-- 视频展示区域 -->
            <div class="w-full aspect-[4/3] mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0 relative">
                <!-- 如果图片上传了，则显示上传的图片 -->
                <img v-if="imageUrl && !videoUrl" :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover absolute top-0 left-0" />
                <!-- 视频显示 -->
                <video v-if="videoUrl" :src="videoUrl" :poster="coverImageUrl" controls class="w-full h-full object-cover"></video>
                <!-- 加载动画 -->
                <div v-if="isLoading && imageUrl" class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div class="spinner-border animate-spin border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full"></div>
                </div>
                <div v-if="!videoUrl && !imageUrl" class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <!-- 上传图片 -->
                <div>
                    <label for="imageUpload" class="text-sm font-semibold mb-2">上传图像（可选）</label>
                    <input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png"
                        @change="handleImageUpload"
                        :disabled="isLoading"
                        class="mb-4 mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <div class="relative">
                    <label for="inputText" class="text-sm font-semibold">
                        描述
                        <a href="javascript:void(0)" class="text-blue-500 cursor-pointer float-right" @click="optimizeInput">优化提示词</a>
                    </label>
                    <textarea
                        v-model="inputText"
                        :disabled="disabled"
                        class="text-sm w-full h-[120px] p-2 text-lg border rounded-md focus:ring-2 mb-4 mt-2"
                        placeholder="请输入您希望生成的视频效果描述！"
                    ></textarea>
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
            imageUrl: null, // 用于显示上传的图片
            imageBase64: '', // 用于传递Base64编码的图片
            isLoading: false,
            disabled: false,
            inputTip: '',
            generatedContent: null
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

            // 如果有上传的图像，将图像 URL 或 Base64 传入
            const requestBody = {
                model: modelName,
                prompt: fullPrompt,
                with_audio: true,
                image_url: this.imageBase64 ? `data:image/png;base64,${this.imageBase64}` : null
            }

            // 生成视频并轮询任务状态
            const taskId = await this.generateVideo(apiUrl, apiKey, modelName, requestBody)
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
                            content: `你是一名提示词优化助手，请将用户的白话描述转换更加动人和详细，重点在动作，100以内`
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
        async generateVideo(apiUrl, apiKey, modelName, requestBody) {
            this.inputTip = '生成中，请不要退出页面！'
            this.isLoading = true
            this.videoUrl = null
            try {
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
                        const errorResponse = await response.json() // 解析错误响应
                        const errorMessage = errorResponse.error?.message || `HTTP error! Status: ${response.status}`
                        throw new Error(errorMessage) // 抛出错误信息
                    }

                    const result = await response.json()
                    if (result.task_status === 'SUCCESS') {
                        this.isLoading = false
                        this.videoUrl = result.video_result[0]?.url
                        this.coverImageUrl = result.video_result[0]?.cover_image_url
                        this.imageUrl = null // 清除上传的图片
                        return
                    } else if (result.status === 'failed') {
                        throw new Error('Video generation failed')
                    }
                } catch (error) {
                    console.error('Error polling task status:', error)
                    alert(error.message) // 弹出错误信息
                    this.isLoading = false
                    this.videoUrl = null
                    this.coverImageUrl = null
                    this.imageUrl = null
                    this.inputText = ''
                    return
                }

                await new Promise(resolve => setTimeout(resolve, interval))
            }

            console.error('Task polling timed out')
        },

        // 上传图片
        async handleImageUpload(event) {
            this.generatedContent = null
            const file = event.target.files[0]
            if (!file) return

            // 检查文件格式
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                alert('仅支持 JPG、JPEG、PNG 格式的图片')
                return
            }

            // 检查图片像素（不超过 6000x6000）
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = async () => {
                const width = img.width
                const height = img.height
                if (width > 6000 || height > 6000) {
                    alert('图片像素不能超过 6000x6000')
                    return
                }

                // 如果图片大小超过 5MB，则进行压缩
                if (file.size > 5 * 1024 * 1024) {
                    try {
                        const compressedFile = await this.compressImage(file)
                        this.imageUrl = URL.createObjectURL(compressedFile)
                        this.imageBase64 = await this.fileToBase64(compressedFile)
                    } catch (error) {
                        console.error('图片压缩失败:', error)
                        alert('图片压缩失败，请重试')
                        return
                    }
                } else {
                    // 图片大小在 5MB 以内，直接处理
                    const reader = new FileReader()
                    reader.onload = e => {
                        this.imageUrl = e.target.result // 用于显示图片
                        this.imageBase64 = e.target.result.split(',')[1] // 提取 Base64 数据部分
                    }
                    reader.readAsDataURL(file)
                }
            }
        },

        // 压缩图片
        compressImage(file) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = URL.createObjectURL(file)
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')

                    // 设置最大宽度和高度
                    const maxWidth = 6000
                    const maxHeight = 6000
                    let width = img.width
                    let height = img.height

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height)
                        width *= ratio
                        height *= ratio
                    }

                    canvas.width = width
                    canvas.height = height

                    // 绘制图片到 canvas
                    ctx.drawImage(img, 0, 0, width, height)

                    // 将 canvas 转换为 Blob
                    canvas.toBlob(
                        blob => {
                            if (!blob) {
                                reject(new Error('图片压缩失败'))
                                return
                            }

                            // 检查压缩后的文件大小
                            if (blob.size > 5 * 1024 * 1024) {
                                // 如果仍然大于 5MB，降低质量
                                canvas.toBlob(
                                    newBlob => {
                                        if (!newBlob) {
                                            reject(new Error('图片压缩失败'))
                                            return
                                        }
                                        resolve(newBlob)
                                    },
                                    file.type,
                                    0.5 // 降低质量
                                )
                            } else {
                                resolve(blob)
                            }
                        },
                        file.type,
                        0.8 // 初始质量
                    )
                }
                img.onerror = error => reject(error)
            })
        },

        // 将文件转换为 Base64
        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => resolve(e.target.result.split(',')[1])
                reader.onerror = error => reject(error)
                reader.readAsDataURL(file)
            })
        }
    }
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    padding-bottom: 50px;
}
textarea {
    outline: none;
}
.head-title {
    font-size: 18px;
    margin-bottom: 10px;
}
.spinner-border {
    border-width: 4px;
    border-top-color: #3498db;
    border-bottom-color: #3498db;
    border-radius: 50%;
}
</style>
