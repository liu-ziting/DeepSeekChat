<template>
    <div class="min-h-screen bg-gray-900" @click="handleVideoClick">
        <div v-if="!currentVideo" class="fixed inset-0 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <video ref="videoPlayer" :src="currentVideo" playsinline autoplay class="fixed inset-0 w-full h-full object-contain" @error="handleVideoError"></video>

        <button
            v-if="showButton"
            @click="fetchNextVideo"
            class="fixed bottom-10 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 z-10"
        >
            下一个更好
        </button>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            currentVideo: '',
            retryCount: 0,
            maxRetries: 3,
            showButton: true,
            hasInteracted: false
        }
    },
    mounted() {
        document.title = '下一个更好'
        this.fetchNextVideo()
        // 检测微信环境在执行
        if (this.isWeChat()) {
            setTimeout(() => {
                this.fetchNextVideo()
            }, 1000)
        }
    },
    methods: {
        isWeChat() {
            return /micromessenger/.test(navigator.userAgent.toLowerCase())
        },
        async fetchNextVideo() {
            this.currentVideo = ''
            this.showButton = false
            try {
                const response = await axios.get('https://api.kuleu.com/api/MP4_xiaojiejie?type=json')
                if (response.data.code === 200) {
                    const videoUrl = response.data.mp4_video
                    const isValid = await this.checkVideoExists(videoUrl)

                    if (isValid) {
                        this.currentVideo = videoUrl
                        this.retryCount = 0
                        this.playVideo()
                    } else {
                        console.warn('Video file not found (404), retrying...')
                        this.retryIfNeeded()
                    }
                }
            } catch (error) {
                console.error('Error fetching video:', error)
                this.retryIfNeeded()
            }
        },
        async checkVideoExists(url) {
            try {
                const response = await fetch(url, { method: 'HEAD' })
                return response.ok // `true` 代表视频可访问，否则 `false`
            } catch (error) {
                console.error('Error checking video existence:', error)
                return false
            }
        },
        playVideo() {
            const video = this.$refs.videoPlayer
            if (video) {
                video.play().catch(error => {
                    console.error('Video play failed:', error)
                })
            }
        },
        handleVideoClick() {
            if (!this.hasInteracted) {
                this.hasInteracted = true
                this.playVideo()
            }
            this.showButton = !this.showButton
        },
        handleVideoError() {
            console.error('Video playback error: File not found or inaccessible', this.currentVideo)

            if (this.retryCount < this.maxRetries) {
                this.retryCount++
                setTimeout(() => {
                    // this.fetchNextVideo()
                }, 1000)
            } else {
                alert('当前视频无法播放，请尝试获取下一个视频')
                this.showButton = true // 显示“下一个更好”按钮
            }
        },
        retryIfNeeded() {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++
                setTimeout(() => {
                    this.fetchNextVideo()
                }, 1000)
            } else {
                console.error('Max retries reached')
            }
        }
    }
}
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@media (min-width: 768px) {
    .min-h-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    video {
        max-width: 100%;
        max-height: 100%;
        margin: auto;
    }
}
</style>
