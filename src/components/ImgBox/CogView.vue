<template>
    <div class="container mx-auto p-4">
        <div class="flex flex-col lg:flex-row lg:gap-8">
            <!-- 图片展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <img :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover" v-if="imageUrl" />
                <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <textarea
                    v-model="inputText"
                    class="text-sm w-full h-30 p-2 text-lg border rounded-md focus:ring-2"
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

                <button
                    @click="submitData"
                    class="text-sm w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    :disabled="!inputText || isLoading"
                >
                    {{ isLoading ? '生成中...' : '生成图片' }}
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
            selectedStyle: '',
            imageUrl: '',
            isLoading: false,
            styles: [
                { name: '未来感', prompt: '充满未来感的画风，科技感十足，闪烁的霓虹灯，充满数字化、虚拟现实和科技元素，机械感十足，光影交错，具有高科技和城市未来主义氛围' },
                { name: '极简主义', prompt: '极简主义艺术风格，简约的线条与形状，少即是多，色调简单而高雅，采用大面积留白，着重细节与平衡' },
                {
                    name: '复古怀旧',
                    prompt: '复古怀旧风格，温暖的色调，柔和的光影，仿佛回到过去的年代，充满了怀旧情感和温馨气息，图像呈现老旧照片效果，可能带有一些颗粒感或褪色感'
                },
                {
                    name: '中国古风',
                    prompt: '中国古代风格，水墨画、山水画、古风建筑和装饰，带有诗意、优雅、传统的元素，色调柔和，细腻的笔触，融合中国文化特色如花鸟、古典服饰、亭台楼阁'
                },
                {
                    name: '赛博朋克',
                    prompt: '赛博朋克风格，未来城市夜景，光鲜的霓虹灯，未来科技感的建筑，高科技与低生活交织，充满都市感，阴暗且充满反乌托邦氛围，色彩强烈且有对比'
                },
                { name: '卡通', prompt: '卡通风格，简洁的线条，鲜艳的色彩，人物和场景设计非常夸张，极富表现力和动感，具有童趣和夸张的表情，充满童话色彩' },
                { name: '抽象艺术', prompt: '抽象艺术风格，色彩斑斓的几何图形，充满能量的线条和形状，图像不拘一格，色彩搭配鲜明，模糊具象的边界，视觉冲击力强' },
                { name: '暗黑风', prompt: '暗黑风格，哥特风格，浓重的阴影，强烈的对比，充满神秘感和恐怖氛围，色调冷酷且严肃，可能包含暗夜、古堡、诡异生物等元素' },
                { name: '幻想风', prompt: '幻想风格，奇幻世界的景象，神话中的生物和场景，丰富的魔法、幻想森林、梦幻云朵等，充满梦境般的色彩和氛围，可能包含奇幻的城市或魔法元素' },
                { name: '写实', prompt: '写实风格，图像精确细腻，真实世界的场景或者人物，光影效果自然，细节丰富，物体的纹理和质感精准还原，具备照片般的清晰度' },
                { name: '蒸汽朋克', prompt: '蒸汽朋克风格，古老的机械装置与未来科技相结合，金属质感的机械零件与复古的装饰物融合，背景通常包含工业化的城市和蒸汽引擎' },
                { name: '日式和风', prompt: '日式和风风格，结合传统日本文化元素，如樱花、富士山、和风庭院，淡雅的色调和清新的自然风光，常用淡粉色和浅绿色，清新、宁静、温和' },
                { name: '超现实主义', prompt: '超现实主义风格，图像不受现实世界的限制，具有梦幻、幻想和荒诞的特征，场景和人物常常是无法解释的，并且充满着梦境般的符号和奇特形象' },
                { name: '海洋风', prompt: '海洋风格，蓝色的海洋、波浪和沙滩，海风轻拂，水下世界的生物、海洋景观，色调清爽、自然，画面清新宜人，充满海洋气息和自然景象' },
                { name: '现代主义', prompt: '现代主义艺术风格，直线与曲线的完美结合，图像富有对称性和几何感，色彩冷静、理性，表现出现代科技、建筑和都市环境的简单与高效' },
                { name: '梦幻风', prompt: '梦幻风格，轻柔的色调和迷离的氛围，带有仙境般的气息，场景充满神秘与浪漫，光影的使用营造出柔和、梦幻的感受，常见朦胧和流动的元素' }
            ],
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
            if (!this.inputText || !this.selectedStyle) return

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

<style>
textarea {
    outline: none;
}
</style>
