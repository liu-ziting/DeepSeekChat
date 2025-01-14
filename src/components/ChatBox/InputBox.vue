<template>
    <div class="form fixed bottom-9 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <form @submit.prevent="handleSubmit" class="flex gap-2 items-end">
            <textarea
                ref="textarea"
                v-model="userInput"
                placeholder="来说点什么..."
                class="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                :disabled="isThinking"
                rows="1"
                @input="handleInput"
                @keydown="handleKeydown"
            ></textarea>
            <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" :disabled="isThinking">
                发送
            </button>
        </form>
    </div>
</template>

<script>
import { autoResizeTextarea, resetTextareaHeight } from '../../utils/helpers'

export default {
    props: {
        isThinking: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userInput: ''
        }
    },
    methods: {
        handleInput(event) {
            autoResizeTextarea(event.target)
        },
        handleKeydown(event) {
            if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
                event.preventDefault()
                this.handleSubmit()
            } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                this.userInput += '\n'
                autoResizeTextarea(this.$refs.textarea)
            }
        },
        handleSubmit() {
            this.$emit('send-message', this.userInput)
            this.userInput = ''
            resetTextareaHeight(this.$refs.textarea)
            this.$emit('scroll-to-bottom')
        }
    }
}
</script>
