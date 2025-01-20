<template>
    <div class="mb-4">
        <div :class="messageClass">
            <div v-if="message.role === 'assistant'" class="w-10 h-10 flex items-center justify-center rounded-full">
                <IconAI />
            </div>

            <div class="flex flex-col" style="max-width: calc(100% - 50px)">
                <span v-if="message.role === 'assistant' && message.model === 'deepseek' && !name" class="text-sm font-medium mb-1" :class="nameClass">
                    {{ message.mode === 'normal' ? '😀' : message.mode === 'angry' ? '😡' : '🤬' }}
                </span>
                <!-- <span v-if="name && message.role === 'assistant'" class="text-sm font-medium mb-1" :class="nameClass">{{ name }}</span> -->
                <div :class="bubbleClass">
                    <pre v-if="isCode(message.content)" class="whitespace-pre-wrap rounded-lg"><code>{{ message.content }}</code></pre>
                    <span v-else>{{ message.content }}</span>
                </div>
                <div>
                    <p
                        v-for="(presets, index) in message.presets"
                        :key="index"
                        class="preset-item cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 border border-gray-300"
                        @click="handlePresetClick(presets)"
                    >
                        {{ presets }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { isCode } from '../../utils/helpers'
import IconAI from '../IconBox/IconAI.vue'

export default {
    components: {
        IconAI
    },
    props: {
        message: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: false
        }
    },
    computed: {
        messageClass() {
            return this.message.role === 'user' ? 'flex justify-end items-start gap-3' : 'flex justify-start items-start gap-3'
        },
        bubbleClass() {
            return this.message.role === 'user' ? 'bg-blue-500 text-white rounded-lg p-3 ' : 'bg-gray-200 text-gray-800 rounded-lg p-3 '
        },
        nameClass() {
            return this.message.role === 'user' ? 'text-right text-blue-500' : 'text-left text-gray-600'
        }
    },
    methods: {
        isCode,
        handlePresetClick(preset) {
            this.$emit('preset-click', preset)
        }
    }
}
</script>

<style scoped>
.preset-item {
    margin: 4px 0;
    color: #4a5568; /* 预设文本颜色 */
    font-size: 0.875rem; /* 预设文本大小 */
    border: 1px solid #e2e8f0; /* 边框颜色 */
}

.preset-item:hover {
    background-color: #f7fafc; /* 悬停背景色 */
    border-color: #cbd5e0; /* 悬停时边框颜色加深 */
}
</style>
