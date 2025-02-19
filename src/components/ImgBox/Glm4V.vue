<template>
    <div class="container mx-auto pl-4 pr-4">
        <!-- 布局容器 -->
        <div class="flex flex-col lg:flex-row lg:gap-8 lg:mt-10">
            <!-- 图片展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <img @click="openShareDialog" :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover" v-if="imageUrl" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <!-- 右侧区域（生成内容、输入框、按钮） -->
            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                    <h3 class="head-title font-bold text-left cursor-pointer transition-all relative">
                        {{ functions[selectedFunction].name }}

                        <span v-if="audioUrl" @click="playAudio" class="absolute right-0 bottom-0">
                            <svg t="1739841967805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8023" width="25" height="25">
                                <path d="M573.0816 532.48m-403.5072 0a403.5072 403.5072 0 1 0 807.0144 0 403.5072 403.5072 0 1 0-807.0144 0Z" fill="#A5ADF6" p-id="8024"></path>
                                <path d="M451.4816 490.4448m-403.5072 0a403.5072 403.5072 0 1 0 807.0144 0 403.5072 403.5072 0 1 0-807.0144 0Z" fill="#A5ADF6" p-id="8025"></path>
                                <path
                                    d="M169.5744 532.48c0 153.6 85.8624 287.1808 212.1728 355.328 22.6816 3.9424 45.9264 6.144 69.7344 6.144 222.8736 0 403.5072-180.6848 403.5072-403.5072 0-153.6-85.8624-287.1808-212.1728-355.328-22.6816-3.9424-45.9264-6.144-69.7344-6.144-222.8736 0-403.5072 180.6336-403.5072 403.5072z"
                                    fill="#635DF7"
                                    p-id="8026"
                                ></path>
                                <path
                                    d="M373.8112 715.8272c-15.0528 0-30.1056-3.9424-43.8272-11.8784-27.4432-15.8208-43.8272-44.2368-43.8272-75.9296V381.4912c0-31.6928 16.384-60.0576 43.8272-75.9296 27.4432-15.8208 60.2112-15.8208 87.6544 0l213.504 123.2896c27.4432 15.8208 43.8272 44.2368 43.8272 75.9296 0 31.6928-16.384 60.0576-43.8272 75.8784l-213.504 123.2896c-13.6704 7.8848-28.7744 11.8784-43.8272 11.8784z m0.0512-340.1216c-0.8192 0-1.8432 0.2048-2.9184 0.8192-2.8672 1.6384-2.8672 4.1472-2.8672 4.9664v246.528c0 0.8192 0 3.328 2.8672 4.9664 2.8672 1.6896 5.0176 0.4096 5.7344 0l213.504-123.2896c0.7168-0.4096 2.8672-1.6384 2.8672-4.9664 0-3.328-2.1504-4.5568-2.8672-4.9664l-213.504-123.2896c-0.4096-0.2048-1.4336-0.768-2.816-0.768z"
                                    fill="#FFFFFF"
                                    p-id="8027"
                                ></path>
                            </svg>
                        </span>
                    </h3>
                    <div class="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
                        <p v-if="generatedContent">
                            {{ generatedContent }}
                        </p>
                        <p v-else class="text-gray-500">
                            {{ isLoading ? '识别中...' : functions[selectedFunction].placeholder }}
                        </p>
                    </div>
                    <audio :src="audioUrl" ref="audioRef" style="display: none"></audio>
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
                        class="text-sm w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <span v-if="isLoading">正在识别</span>
                        <span v-else>{{ functions[selectedFunction].buttonText }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 分享弹窗 -->
        <div v-if="isShareDialogOpen" class="propup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-4 shadow-lg w-96">
                <div class="flex flex-col items-center">
                    <div class="post-card">
                        <a href="javascript:;" class="title">{{ generatedContent }}</a>
                        <span class="datetime"></span>
                        <div class="image-preview">
                            <img :src="imageUrl" alt="Pet Image" class="w-full h-64 object-cover mb-4 rounded-md" />
                        </div>
                        <!-- 修改后的 qrcode-preview 部分 -->
                        <div class="qrcode-preview flex items-center justify-between w-full">
                            <div class="text-left">
                                <p class="text-sm text-gray-600">内容由AI生成</p>
                                <p class="text-sm text-gray-600">irritable.netlify.app</p>
                            </div>
                            <img class="qrcode w-12 h-12" src="~@/assets/qrcode.png" />
                        </div>
                    </div>
                    <br />
                    <button @click="saveShareToLocal" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">保存到本地</button>
                    <button @click="closeShareDialog" class="mt-4 text-gray-500 hover:text-gray-700">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchAIResponse, API_CONFIG, fetchTTS } from '../../utils/api'
import IconGlm from '../IconBox/IconGlm.vue'
import html2canvas from 'html2canvas'
import { ImagePrompts } from '../../utils/prompt.js'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            imageUrl: null, // 用于显示图片的 URL
            imageBase64: null, // 用于存储 Base64 格式的图片
            generatedContent: null,
            isLoading: false, // 加载状态
            isShareDialogOpen: false, // 分享弹窗是否打开
            selectedFunction: 0, // 默认选择第一个功能
            functions: ImagePrompts,
            abortController: null, // 用来保存 AbortController 实例
            audioUrl: null // 用于存储语音的 URL
        }
    },
    methods: {
        // 切换功能
        switchFunction() {
            this.selectedFunction = (this.selectedFunction + 1) % this.functions.length
        },
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
            // 创建新的 AbortController 实例
            this.abortController = new AbortController()
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
                                text: this.functions[this.selectedFunction].prompt
                            }
                        ]
                    }
                ]
                const { apiUrl, apiKey, modelName, temperature } = API_CONFIG['stepfun']

                const stream = true
                // 用于存储流式响应的内容
                let streamContent = ''
                await fetchAIResponse(
                    apiUrl,
                    apiKey,
                    modelName,
                    messages,
                    temperature,
                    stream,
                    chunk => {
                        if (this.abortController.signal.aborted) {
                            return // 请求被中止，退出
                        }
                        // 逐步更新消息内容
                        if (chunk.type === 'content') {
                            streamContent += chunk.content
                            this.generatedContent = streamContent
                        }
                    },
                    this.abortController
                )
                // this.generatedContent = data.choices[0].message.content

                // 移除表情符号
                const cleanedContent = streamContent.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
                // 移除所有双引号和空格
                const trimmedContent = cleanedContent.replace(/["\s]/g, '')
                // 调用 generateTTS，并传递清理后的生成内容
                this.generateTTS(trimmedContent)
            } catch (error) {
                console.error('Error fetching AI response:', error)
                this.generatedContent = '识别失败，请重试'
            } finally {
                this.isLoading = false // 结束加载
            }
        },
        // 生成tts
        async generateTTS(content) {
            const { apiUrl, apiKey, modelName } = API_CONFIG['stepfunTTS']
            const input = content
            const voice = 'jilingshaonv'

            try {
                const blob = await fetchTTS(apiUrl, apiKey, modelName, input, voice)
                this.audioUrl = URL.createObjectURL(blob)
                // 自动播放音频
                this.$nextTick(() => {
                    const audioElement = this.$el.querySelector('audio')
                    if (audioElement) {
                        audioElement.play()
                    }
                })
            } catch (error) {
                console.error('Error generating speech:', error)
            }
        },
        playAudio() {
            const audio = this.$refs.audioRef
            if (audio) {
                audio.play().catch(error => {
                    console.error('音频播放错误:', error)
                })
            }
        },
        // 打开分享弹窗
        openShareDialog() {
            this.isShareDialogOpen = true
        },

        // 关闭分享弹窗
        closeShareDialog() {
            this.isShareDialogOpen = false
        },

        // 保存分享内容到本地
        saveShareToLocal() {
            const postCardElement = document.querySelector('.post-card') // 获取 .post-card 元素
            if (!postCardElement) {
                alert('未找到分享内容')
                return
            }
            // 使用 html2canvas 生成图片
            html2canvas(postCardElement, {
                allowTaint: true, // 允许跨域
                useCORS: true, // 启用 CORS
                scale: 2, // 提高分辨率，避免模糊
                onclone: clonedDoc => {
                    // 在克隆的文档中调整图片样式，确保图片不会被拉伸
                    const clonedImg = clonedDoc.querySelector('.image-preview img')
                    if (clonedImg) {
                        // 确保图片保持比例
                        clonedImg.style.objectFit = 'cover'
                        clonedImg.style.width = '100%'
                        clonedImg.style.height = '100%'
                    }
                }
            })
                .then(canvas => {
                    // 将 canvas 转为 Data URL
                    const imageUrl = canvas.toDataURL('image/png')

                    // 创建一个下载链接并触发点击事件保存图片
                    const link = document.createElement('a')
                    link.href = imageUrl
                    link.download = 'pet-conversation.png' // 图片的默认保存名
                    link.click() // 模拟点击下载图片
                })
                .catch(error => {
                    console.error('生成图片失败:', error)
                    alert('生成图片失败，请重试')
                })
        }
    }
}
</script>

<style scoped>
.container {
    padding-bottom: 50px;
}
.head-title {
    font-size: 16px;
    margin-bottom: 10px;
}

.propup {
    z-index: 999;
}
.post-card {
    width: 100%;
    border-radius: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #fff;
}

.avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    background-color: blueviolet;
    background-image: linear-gradient(to top left, blueviolet, rgb(73, 31, 112));
}

.title {
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    color: #000000;
    text-decoration: none;
    transition: all 0.35s ease-in;
}

.title:hover {
    text-decoration: underline blueviolet;
}

.datetime {
    font-size: 12px;
    color: rgb(168 179 207);
    margin: 10px 0;
}

.image-preview {
    flex: 1;
    width: 100%;
    border-radius: 20px;
    min-height: 200px;
}
.image-preview img {
    width: 100%;
    height: 300px;
    object-fit: over;
}
</style>
