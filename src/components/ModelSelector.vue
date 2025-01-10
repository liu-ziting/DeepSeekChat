<template>
    <div class="model-selector flex justify-center gap-4 p-4 bg-white border-b border-gray-200">
        <label class="radio" @click="changeModel('deepseek')">
            <input type="radio" name="model" :checked="model === 'deepseek'" />
            <span class="name">DeepSeek</span>
        </label>
        <label class="radio" @click="changeModel('gemini')">
            <input type="radio" name="model" :checked="model === 'gemini'" />
            <span class="name">Gemini</span>
        </label>
        <label class="radio" @click="changeModel('bigmodel')">
            <input type="radio" name="model" :checked="model === 'bigmodel'" />
            <span class="name">智谱</span>
        </label>
        <label class="radio" @click="changeModel('kimi')">
            <input type="radio" name="model" :checked="model === 'kimi'" />
            <span class="name">月之暗面</span>
        </label>
        <label class="radio" v-show="false">
            <input type="radio" name="model" disabled />
            <span class="name" style="color: #9ca3af">实时视频交互模式</span>
        </label>
    </div>
</template>

<script>
export default {
    props: {
        model: {
            type: String,
            required: true
        }
    },
    methods: {
        changeModel(newModel) {
            this.$emit('change-model', newModel)
        }
    }
}
</script>
