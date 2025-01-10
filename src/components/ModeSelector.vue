<template>
    <div class="radio-inputs flex justify-center gap-4 p-4 bg-white border-b border-gray-200">
        <label class="radio" @click="changeMode('normal')">
            <input type="radio" name="radio" :checked="mode === 'normal'" />
            <span class="name">正常模式</span>
        </label>
        <label class="radio" @click="changeMode('angry')">
            <input type="radio" name="radio" :checked="mode === 'angry'" />
            <span class="name">暴躁模式</span>
        </label>
        <label class="radio" @click="changeMode('rude')">
            <input type="radio" name="radio" :checked="mode === 'rude'" />
            <span class="name">祖安模式</span>
        </label>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            required: true
        }
    },
    methods: {
        changeMode(newMode) {
            this.$emit('change-mode', newMode)
        }
    }
}
</script>
