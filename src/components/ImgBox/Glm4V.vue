<template>
    <div class="container mx-auto p-4">
        <!-- 标题 -->
        <h2 class="head-title text-2xl font-bold text-center mb-6">我知道你的宠物在想什么！</h2>

        <!-- 布局容器 -->
        <div class="flex flex-col lg:flex-row lg:gap-8">
            <!-- 图片展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <img :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover" v-if="imageUrl" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <!-- 右侧区域（生成内容、输入框、按钮） -->
            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <!-- 生成的内容 -->
                <div class="mb-4 p-4 bg-gray-100 rounded-lg">
                    <p v-if="generatedContent">{{ generatedContent }}</p>
                    <p v-else class="text-gray-500">请上传宠物的照片，让我看看它在想些什么呢！</p>
                </div>

                <!-- 底部区域（输入框和按钮） -->
                <div class="mt-auto">
                    <!-- 上传图片的输入框 -->
                    <input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png"
                        @change="handleImageUpload"
                        :disabled="isLoading"
                        class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <!-- 开始识别按钮 -->
                    <button
                        @click="startRecognition"
                        :disabled="!imageUrl || isLoading"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <span v-if="isLoading">正在识别中...</span>
                        <span v-else>开始识别</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchAIResponse, API_CONFIG } from '../../utils/api'
import IconGlm from '../IconBox/IconGlm.vue'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            imageUrl: null, // 用于显示图片的 URL
            imageBase64: null, // 用于存储 Base64 格式的图片
            generatedContent: null,
            isLoading: false // 加载状态
        }
    },
    methods: {
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
        },
        async startRecognition() {
            if (!this.imageBase64) {
                alert('请先上传图片')
                return
            }

            this.isLoading = true // 开始加载

            try {
                const messages = [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${this.imageBase64}` // 使用 Base64 格式的图片
                                }
                            },
                            {
                                type: 'text',
                                text: `
                                # 角色：  
                                宠物行为解读专家，能够通过照片精准识别宠物种类，并分析其情绪状态和心理活动。
                                # 工作流程：  
                                1. 仔细观察宠物的肢体语言、面部表情和所处环境。
                                2. 结合动物行为学知识，推测宠物的心理状态。
                                3. 用第一人称拟人化表达，语气要符合宠物特征。
                                4. 在对话前添加一个与情绪匹配的表情符号。
                                5. 输出格式：[表情符号] "宠物的对话内容"（使用自然口语化的中文表达）。
                                
                                # 输出示例：  
                                😺 "哎呀，今天的阳光真是暖和，我懒洋洋地躺在窗台上，享受着这份宁静。"
                                😸 "咦，那边有只小鸟，看起来好好玩！我悄悄地靠近，准备给它一个惊喜。"
                                😾 "嗯？主人怎么还不回来？我一个人好无聊，只好玩玩毛线球打发时间了。"
                                # 注意事项：  
                                - 一定要确保识别出来的是宠物，否则不要回答。
                                - 若图片中未识别到宠物，统一回复："图片中没有宠物~"。
                                - 仅输出带表情符号的对话内容或指定提示。
                                - 不使用"好的"等确认性回复。
                                - 不使用括号补充说明。
                                - 保持专业且生动的表达风格。
                                - 确保解读基于图片中的可见信息。`
                            }
                        ]
                    }
                ]

                const { apiUrl, apiKey, modelName, temperature } = API_CONFIG['bigmodel']
                const data = await fetchAIResponse(apiUrl, apiKey, modelName, messages, temperature)

                this.generatedContent = data.choices[0].message.content
            } catch (error) {
                console.error('Error fetching AI response:', error)
                this.generatedContent = '识别失败，请重试'
            } finally {
                this.isLoading = false // 结束加载
            }
        }
    }
}
</script>

<style scoped>
.head-title {
    font-size: 18px;
    margin-bottom: 10px;
}
.submit-button {
    margin-bottom: 50px;
}
</style>
