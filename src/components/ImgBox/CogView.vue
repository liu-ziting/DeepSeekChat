<template>
    <div class="container mx-auto pl-4 pr-4">
        <div class="flex flex-col lg:flex-row lg:gap-8 lg:mt-10">
            <!-- 图片展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <img :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover" v-if="imageUrl" />
                <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                    <!-- <h2 class="head-title font-bold text-left cursor-pointer transition-all">AI图片生成器</h2> -->

                    <textarea
                        v-model="inputText"
                        class="text-sm w-full h-[80px] p-2 text-lg border rounded-md focus:ring-2"
                        placeholder="请输入需要生成的图片，尽可能描述清楚图片内容，才能更加准确地生成图片！"
                    ></textarea>

                    <div class="my-4">
                        <label class="block text-lg font-medium mb-2 text-sm"
                            >选择风格
                            <span @click="shuffleStyles" class="text-blue-500 cursor-pointer float-right">换一批</span>
                        </label>
                        <div class="grid grid-cols-4 gap-1">
                            <button
                                v-for="style in currentStyles"
                                :key="style.name"
                                style="font-size: 14px"
                                :class="['p-2 rounded-md border focus:outline-none', selectedStyle === style.name ? 'bg-blue-500 text-white' : 'bg-gray-200']"
                                @click="selectStyle(style.name)"
                            >
                                {{ style.name }}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        @click="submitData"
                        class="text-sm w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                        :disabled="!inputText || isLoading"
                    >
                        {{ isLoading ? '创作中...' : '开始创作' }}
                    </button>
                </div>
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
            selectedStyle: '',
            imageUrl: '',
            isLoading: false,
            styles: ImageCogView,
            currentStyles: []
        }
    },
    methods: {
        selectStyle(styleName) {
            this.selectedStyle = styleName
        },
        shuffleStyles() {
            // 随机从styles中选择3个不同的风格
            const shuffled = this.styles.sort(() => Math.random() - 0.5).slice(0, 4)
            this.currentStyles = shuffled
        },
        async submitData() {
            if (!this.inputText) return

            const { apiUrl, apiKey, modelName } = API_CONFIG['bigmodelCogview']
            const stylePrompt = this.styles.find(style => style.name === this.selectedStyle)?.prompt || ''
            const fullPrompt = `${this.inputText}，${stylePrompt}`

            await this.getAIResponse(apiUrl, apiKey, modelName, fullPrompt)
        },
        async getAIResponse(apiUrl, apiKey, modelName, prompt) {
            this.isLoading = true
            this.imageUrl = null
            try {
                const requestBody = {
                    model: modelName,
                    prompt
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
                this.imageUrl = result.data[0]?.url || ''
            } catch (error) {
                console.error('Error fetching AI response:', error)
            } finally {
                this.isLoading = false
            }
        }
    },
    mounted() {
        // 初始化时先加载3个风格
        this.shuffleStyles()
    }
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
    font-size: 16px;
    margin-bottom: 10px;
}
</style>
