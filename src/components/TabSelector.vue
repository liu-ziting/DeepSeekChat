<template>
    <div class="model-selector flex justify-center gap-4 p-4 bg-white border-b border-gray-200">
        <label class="radio" @click="changeModel('chat')">
            <input type="radio" name="tab" :checked="tab === 'chat'" />
            <span class="name">对话</span>
        </label>
        <label class="radio" @click="changeModel('image')">
            <input type="radio" name="tab" :checked="tab === 'image'" />
            <span class="name">识图</span>
        </label>
    </div>
</template>

<script>
export default {
    props: {
        tab: {
            type: String,
            required: true
        }
    },
    methods: {
        changeModel(newModel) {
            this.$emit('tab-selected', newModel)
        }
    }
}
</script>
