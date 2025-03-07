<template>
    <div class="container mx-auto pl-4 pr-4">
        <h2 class="text-xl font-bold mt-4 mb-4">我知道你的图片是否违规了！</h2>
        <div class="flex flex-col">
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden" @paste="handlePaste">
                <img v-if="imageUrl" :src="imageUrl" id="uploaded-img" @load="analyzeImage" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>
            <input
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                @change="handleFileUpload"
                :disabled="isProcessing"
                class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div class="mb-10 p-4 bg-gray-100 rounded-lg text-sm">
                <div class="mb-2 text-lg" ref="resultBox"></div>
                <div v-if="predictions.length" class="mt-2">
                    <p class="mb-2 text-md" v-for="(prediction, index) in predictions" :key="index">
                        - {{ prediction.className }}: {{ (prediction.probability * 100).toFixed(2) }}%
                    </p>
                </div>
                <div v-else>{{ statusMessage }}</div>
            </div>
        </div>
        <!-- 底部介绍 -->
        <footer v-if="false" class="fixed bottom-2 left-3 right-3 border-gray-200 text-xs text-center text-gray-500 z-1">
            <a href="javascript:;" class="text-black-500" @click="openChat">AI大模型对话</a>
            |
            <a href="javascript:;" class="text-black-500" @click="showWeChatQR = true"> 联系作者 </a>
        </footer>
        <div v-if="showWeChatQR" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showWeChatQR = false">
            <div class="bg-white p-4 rounded-lg">
                <img :src="wechatQR" alt="WeChat QR Code" class="w-64 h-100" />
            </div>
        </div>
    </div>
</template>

<script>
import * as nsfwjs from 'nsfwjs'
import IconGlm from '../IconBox/IconGlm.vue'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            imageUrl: '',
            predictions: [],
            model: null,
            wechatQR: require('@/assets/WeChat.jpg'),
            showWeChatQR: false,
            isProcessing: false,
            statusMessage: '请上传图片或粘贴图片，我来鉴定是否包含不雅内容！'
        }
    },
    async mounted() {
        this.model = await nsfwjs.load()
    },
    methods: {
        async handleFileUpload(event) {
            const file = event.target.files[0]
            if (file) {
                this.readImageFile(file)
            }
        },
        async handlePaste(event) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile()
                    this.readImageFile(file)
                    break
                }
            }
        },
        async readImageFile(file) {
            if (!file) return

            this.isProcessing = true
            this.statusMessage = '识别鉴定中...'
            this.predictions = []

            const reader = new FileReader()
            reader.onload = async e => {
                this.imageUrl = e.target.result
                await this.analyzeImage()
            }
            reader.readAsDataURL(file)
        },
        async analyzeImage() {
            this.$refs.resultBox.innerHTML = ''
            this.predictions = []
            const img = document.getElementById('uploaded-img')

            if (!img || !img.complete) {
                console.error('Image not loaded yet!')
                return
            }

            try {
                const model = await nsfwjs.load()
                const predictions = await model.classify(img)

                const Classes = {
                    Neutral: '普通',
                    Hentai: '变态',
                    Porn: '色情',
                    Sexy: '性感'
                }

                const Predictions = {}
                let hasSignificantPrediction = false

                this.predictions = predictions
                    .filter(prediction => prediction.className !== 'Drawing')
                    .map(prediction => {
                        const name = Classes[prediction.className]
                        if (!name) return null

                        const probability = prediction.probability
                        Predictions[name] = probability

                        if (probability > 0.01) {
                            hasSignificantPrediction = true
                        }

                        return { className: name, probability }
                    })
                    .filter(Boolean)

                if (!hasSignificantPrediction) {
                    this.predictions = [{ className: '健康得很', probability: 1 }]
                }

                const rate = Math.max(Predictions['色情'] || 0, Predictions['性感'] || 0, Predictions['变态'] || 0)

                const resultBox = this.$refs.resultBox
                if (resultBox) {
                    let resultText = '无不雅内容'
                    let resultColor = 'text-green-600'

                    if (rate > 0.5) {
                        resultText = '存在不雅内容'
                        resultColor = 'text-red-500'
                    } else if (rate > 0.2) {
                        resultText = '可能包含不雅内容'
                        resultColor = 'text-yellow-500'
                    }

                    resultBox.classList.remove('text-green-600', 'text-red-500', 'text-yellow-500')
                    resultBox.classList.add(resultColor)
                    resultBox.innerHTML = `<p class="text-lg font-bold">${resultText}</p>`
                }
            } catch (error) {
                console.error('Error classifying image:', error)
                this.statusMessage = '识别失败，请重试！'
            } finally {
                this.isProcessing = false
            }
        },
        openChat() {
            this.$router.push('/')
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>
