<template>
    <div class="model-selector flex justify-center p-4 bg-white border-b border-gray-200">
        <label class="radio" @click="changeModel('chat')">
            <input type="radio" name="tab" :checked="tab === 'chat'" />
            <span class="name">多模型</span>
        </label>
        <label class="radio" @click="changeModel('role')">
            <input type="radio" name="tab" :checked="tab === 'role'" />
            <span class="name">角色</span>
        </label>
        <!-- <label class="radio" @click="changeModel('battle')">
            <input type="radio" name="tab" :checked="tab === 'battle'" />
            <span class="name">大模型竞技场</span>
        </label> -->
        <label class="radio" @click="changeModel('image')">
            <input type="radio" name="tab" :checked="tab === 'image'" />
            <span class="name">识图</span>
        </label>
        <label class="radio" @click="changeModel('cogview')">
            <input type="radio" name="tab" :checked="tab === 'cogview'" />
            <span class="name">图片生成</span>
        </label>
        <!-- <label class="radio" @click="changeModel('textvideo')">
            <input type="radio" name="tab" :checked="tab === 'textvideo'" />
            <span class="name">文生视频</span>
        </label> -->
        <label class="radio" @click="changeModel('imgvideo')">
            <input type="radio" name="tab" :checked="tab === 'imgvideo'" />
            <span class="name">视频生成</span>
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
