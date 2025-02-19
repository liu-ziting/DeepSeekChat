<template>
    <div class="model-selector flex justify-center gap-4 p-4 bg-white" style="margin-top: 0">
        <label class="radio" @click="changeModel('shuinifengxin')">
            <input type="radio" name="model" :checked="model === 'shuinifengxin'" />
            <span class="name">水泥封心</span>
        </label>
        <label class="radio" @click="changeModel('deepseek')">
            <input type="radio" name="model" :checked="model === 'deepseek'" />
            <span class="name">DeepSeek-R1</span>
        </label>
        <label class="radio" @click="changeModel('gpt35')">
            <input type="radio" name="model" :checked="model === 'gpt35'" />
            <span class="name">GPT</span>
        </label>
        <label class="radio" @click="changeModel('kimi')">
            <input type="radio" name="model" :checked="model === 'kimi'" />
            <span class="name">Kimi</span>
        </label>
        <label class="radio" @click="changeModel('gemini')">
            <input type="radio" name="model" :checked="model === 'gemini'" />
            <span class="name">Gemini</span>
        </label>
        <label class="radio" @click="changeModel('bigmodel')">
            <input type="radio" name="model" :checked="model === 'bigmodel'" />
            <span class="name">智谱</span>
        </label>
        <!-- <label class="radio" @click="changeModel('stepfunChat')">
            <input type="radio" name="model" :checked="model === 'stepfunChat'" />
            <span class="name">阶跃星辰</span>
        </label> -->
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
