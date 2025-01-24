<template>
    <div class="model-selector flex justify-center gap-4 p-4 bg-white border-b border-gray-200" style="margin-top: 0">
        <label class="radio" @click="changeModel('deepseek')">
            <input type="radio" name="model" :checked="model === 'deepseek'" />
            <span class="name">DeepSeek</span>
        </label>
        <label class="radio" @click="changeModel('bigmodel')">
            <input type="radio" name="model" :checked="model === 'bigmodel'" />
            <span class="name">智谱清言</span>
        </label>
        <label class="radio" @click="changeModel('kimi')">
            <input type="radio" name="model" :checked="model === 'kimi'" />
            <span class="name">月之暗面</span>
        </label>
        <label class="radio" @click="changeModel('gemini')">
            <input type="radio" name="model" :checked="model === 'gemini'" />
            <span class="name">Gemini</span>
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
