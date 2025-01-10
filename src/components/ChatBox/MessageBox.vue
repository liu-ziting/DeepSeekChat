<template>
    <div class="mb-4">
        <div :class="messageClass">
            <div v-if="message.role === 'assistant'" class="w-10 h-10 flex items-center justify-center rounded-full">
                <IconAI />
            </div>
            <div :class="bubbleClass">
                <pre v-if="isCode(message.content)" class="whitespace-pre-wrap rounded-lg"><code>{{ message.content }}</code></pre>
                <span v-else>{{ message.content }}</span>
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
        }
    },
    computed: {
        messageClass() {
            return this.message.role === 'user' ? 'flex justify-end items-start gap-3' : 'flex justify-start items-start gap-3'
        },
        bubbleClass() {
            return this.message.role === 'user' ? 'bg-blue-500 text-white rounded-lg p-3 max-w-[80%]' : 'bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[80%]'
        }
    },
    methods: {
        isCode
    }
}
</script>
