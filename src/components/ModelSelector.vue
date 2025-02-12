<template>
    <div class="model-selector flex justify-center gap-4 p-4 bg-white border-b border-gray-200" style="margin-top: 0">
        <label class="radio" @click="changeModel('shuinifengxin')">
            <input type="radio" name="model" :checked="model === 'shuinifengxin'" />
            <span class="name">水泥封心</span>
        </label>
        <label class="radio" @click="changeModel('qiniuyun')">
            <input type="radio" name="model" :checked="model === 'qiniuyun'" />
            <span class="name">DeepSeek-R1</span>
        </label>

        <label class="radio" @click="changeModel('bigmodel')">
            <input type="radio" name="model" :checked="model === 'bigmodel'" />
            <span class="name">智谱</span>
        </label>
        <label class="radio" @click="changeModel('kimi')">
            <input type="radio" name="model" :checked="model === 'kimi'" />
            <span class="name">Kimi</span>
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
