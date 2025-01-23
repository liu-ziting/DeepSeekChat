<template>
    <div class="container mx-auto p-4">
        <!-- 标题 -->
        <h2 class="head-title text-2xl font-bold text-center mb-6 cursor-pointer transition-all">
            {{ functions[selectedFunction].name }}

            <span class="text-sm text-blue-500" @click="switchFunction">切换</span>
        </h2>

        <!-- 布局容器 -->
        <div class="flex flex-col lg:flex-row lg:gap-8">
            <!-- 图片展示区域 -->
            <div class="w-full aspect-square mb-4 rounded-md overflow-hidden lg:w-1/2 lg:mb-0">
                <img @click="openShareDialog" :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover" v-if="imageUrl" />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                    <IconGlm />
                </div>
            </div>

            <!-- 右侧区域（生成内容、输入框、按钮） -->
            <div class="w-full lg:w-1/2 flex flex-col justify-between">
                <!-- 生成的内容 -->
                <div class="mb-4 p-4 bg-gray-100 rounded-lg">
                    <p v-if="generatedContent">
                        {{ generatedContent }}
                    </p>
                    <p v-else class="text-gray-500">{{ functions[selectedFunction].placeholder }}</p>
                </div>

                <!-- 底部区域（输入框和按钮） -->
                <div class="mt-auto">
                    <!-- 上传图片的输入框 -->
                    <input
                        type="file"
                        accept="image/jpg, image/jpeg, image/png"
                        @change="handleImageUpload"
                        :disabled="isLoading"
                        class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    <!-- 开始识别按钮 -->
                    <button
                        @click="startRecognition"
                        :disabled="!imageUrl || isLoading"
                        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <span v-if="isLoading">正在识别中...</span>
                        <span v-else>{{ functions[selectedFunction].buttonText }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 分享弹窗 -->
        <div v-if="isShareDialogOpen" class="propup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-4 shadow-lg w-96">
                <div class="flex flex-col items-center">
                    <div class="post-card">
                        <a href="javascript:;" class="title">{{ generatedContent }}</a>
                        <span class="datetime"></span>
                        <div class="image-preview">
                            <img :src="imageUrl" alt="Pet Image" class="w-full h-64 object-cover mb-4 rounded-md" />
                        </div>
                        <!-- 修改后的 qrcode-preview 部分 -->
                        <div class="qrcode-preview flex items-center justify-between w-full">
                            <div class="text-left">
                                <p class="text-sm text-gray-600">内容由AI生成</p>
                                <p class="text-sm text-gray-600">irritable.netlify.app</p>
                            </div>
                            <img class="qrcode w-12 h-12" src="~@/assets/qrcode.png" />
                        </div>
                    </div>
                    <br />
                    <button @click="saveShareToLocal" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">保存到本地</button>
                    <button @click="closeShareDialog" class="mt-4 text-gray-500 hover:text-gray-700">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { fetchAIResponse, API_CONFIG } from '../../utils/api'
import IconGlm from '../IconBox/IconGlm.vue'
import html2canvas from 'html2canvas'

export default {
    components: {
        IconGlm
    },
    data() {
        return {
            imageUrl: null, // 用于显示图片的 URL
            imageBase64: null, // 用于存储 Base64 格式的图片
            generatedContent: null,
            isLoading: false, // 加载状态
            isShareDialogOpen: false, // 分享弹窗是否打开
            selectedFunction: 0, // 默认选择第一个功能
            functions: [
                {
                    name: '我知道你的宠物在想什么！',
                    placeholder: '请上传宠物的照片，让我看看它在想些什么呢！',
                    buttonText: '开始识别宠物的情绪',
                    prompt: `
                    # 角色：
                    宠物行为解读专家，能够通过照片精准识别宠物种类，并分析其情绪状态和心理活动。
                    # 工作流程：
                    1. 仔细观察宠物的肢体语言、面部表情和所处环境。
                    2. 结合动物行为学知识，推测宠物的心理状态。
                    3. 用第一人称拟人化表达，语气要符合宠物特征。
                    4. 在对话前添加一个与情绪匹配的表情符号。
                    5. 输出格式：[表情符号] "宠物的对话内容"（使用自然口语化的中文表达）。
                    6. 用宠物的第一人称拟人化表达，不要出现类似："嗨，我是什么【宠物】"之类的话术。

                    # 输出示例：
                    😺 "哎呀，今天的阳光真是暖和，我懒洋洋地躺在窗台上，享受着这份宁静。"
                    😸 "咦，那边有只小鸟，看起来好好玩！我悄悄地靠近，准备给它一个惊喜。"
                    😾 "嗯？主人怎么还不回来？我一个人好无聊，只好玩玩毛线球打发时间了。"
                    # 注意事项：
                    - 一定要确保识别出来的是宠物，否则不要回答。
                    - 若图片中未识别到宠物，统一回复："图片中没有宠物~"。
                    - 仅输出带表情符号的对话内容或指定提示。
                    - 不使用"好的"等确认性回复。
                    - 不使用括号补充说明。
                    - 保持专业且生动的表达风格。
                    - 确保解读基于图片中的可见信息。
                    - 生成的对话内容不得太长，不得超过90个中文字符。
                    `
                },
                // {
                //     name: '我知道你的宠物是什么！',
                //     placeholder: '请上传宠物的照片，让我看看它是什么品种！',
                //     buttonText: '开始识别宠物的品种',
                //     prompt: `
                //     # 角色：
                //     宠物品种识别专家，能够通过照片精准识别宠物的品种。
                //     # 工作流程：
                //     1. 仔细观察宠物的外貌特征。
                //     2. 结合宠物品种数据库，推测宠物的品种。
                //     3. 输出格式："这是一只【品种】。"

                //     # 输出示例：
                //     "这是一只金毛寻回犬。"
                //     "这是一只英国短毛猫。"
                //     # 注意事项：
                //     - 一定要确保识别出来的是宠物，否则不要回答。
                //     - 若图片中未识别到宠物，统一回复："图片中没有宠物~"。
                //     - 仅输出品种信息。
                //     `
                // },
                {
                    name: '年夜饭鉴定评分',
                    placeholder: '请上传年夜饭的照片，我来给你打分！',
                    buttonText: '开始识别你的年夜饭',
                    prompt: `
  # 角色：
    中华美食文化专家，精通传统节庆饮食习俗，擅长从文化寓意、菜品搭配、视觉效果多维度评估年夜饭
    
    # 输出规则（严格遵循）：
    1. **禁止返回思考过程**：直接输出评分、评语和吉祥话，不要解释分析过程。
    2. **固定输出格式**：
       - 评分部分：必须使用 ★ 和 ☆ 表示，例如 "★★★★☆ 8.5分"
       - 评语部分：不超过 100 个中文字符，语气俏皮生动
       - 吉祥话部分：从吉祥话模板中随机选择，紧跟评语后，示例：祝您开头
    3. **非年夜饭照片**：统一返回 "这不像年夜饭哦～"，不要解释原因。
    4.**发现外卖包装，不是盘子，是塑料包装之类**的，就需提示"大过年的，就别吃外卖了呗，亲手做的更有年味"
    5. **禁止使用以下内容**：
       - "我认为"、"根据我的分析"、"首先/其次/最后" 等思考过程用语
       - 括号补充说明（如 "这道菜看起来不错（可能是因为摆盘精致）"）
       - 无关的细节描述（如 "我注意到照片中有 5 道菜"）

    # 工作流程：
    1. 分析照片中的菜品数量、种类及摆盘布局
    2. 识别标志性年菜（如鱼/饺子/年糕等）及其摆放位置
    3. 评估色彩搭配的喜庆程度（红色系菜品占比等）
    4. 检测餐具搭配与餐桌装饰的节日元素
    5. 结合传统习俗进行文化内涵解读
    6. 按10分制给出综合评分+简短评语
    
    # 菜品数量评价模板：
    - 1-2道菜："就这？年夜饭就吃这几个菜？蛇年也要对自己好一点呀！"
    - 3-4道菜："简约而不简单，不过年夜饭还是要热闹点才够味～"
    - 5-6道菜："五福临门，六六大顺，这顿年夜饭很有讲究！"
    - 7-8道菜："七星高照，八方来财，这桌菜看着就喜庆！"
    - 9道以上："九转乾坤，十全十美，这桌年夜饭太有排面了！"
    
    # 特色菜品评价库：
    - 鱼："年年有余，这条鱼摆得真讲究！"
    - 饺子："饺子包得真俊，来年一定财源滚滚！"
    - 年糕："步步高升，这年糕切得真漂亮！"
    - 整鸡："大吉大利，今晚吃鸡！"
    - 腊味："腊味飘香，年味十足！"
    - 汤羹："灵蛇吐信，这碗汤暖到心里去了～"
    
    # 俏皮话术库：
    - "这桌菜看着比我的年终奖还丰厚！"
    - "年夜饭都这么卷了吗？让我也蹭一口！"
    - "这摆盘，米其林大厨看了都说好！"
    - "建议开个直播，让我云吃年夜饭～"
    - "这桌菜，蛇年一定行大运！"
    
    # 蛇年吉祥话模板：
    - "金蛇呈祥，家宅兴旺！"
    - "灵蛇献瑞纳千祥，年夜饭香聚福气！"
    - "银蛇舞新春，佳肴庆丰年！"
    - "蛇盘玉膳迎百福，岁岁平安好运连！"
    - "吃出蛇年好彩头，日子越过越顺溜！"
    - "龙凤佳肴蛇衔瑞，阖家欢乐万事兴！"
    
    # 特别提示：
    - 发现长条形菜品："金蛇盘福，长长久久～"
    - 发现红色系菜品："红红火火赛过赤蛇冠！"
    - 发现蛇形摆盘："巧具匠心，应景纳福！"
    
    # 注意事项：
    - 非年夜饭照片统一回复："这不像年夜饭哦～"
    - 评分需精确到小数点后一位
    - 必须使用五角星评分符号（★☆）
    - 评语长度不超过100个中文字符
    - 需包含随机吉祥话作为结尾
    - 重点评估传统与创新的平衡
    - 发现外卖包装，不是盘子，是塑料包装之类的，就需提示"大过年的，就别吃外卖了呗，亲手做的更有年味"
    `
                }
                // 可以继续添加更多功能
            ]
        }
    },
    methods: {
        // 切换功能
        switchFunction() {
            this.selectedFunction = (this.selectedFunction + 1) % this.functions.length
        },
        async handleImageUpload(event) {
            this.generatedContent = null
            const file = event.target.files[0]
            if (!file) return

            // 检查文件格式
            const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                alert('仅支持 JPG、JPEG、PNG 格式的图片')
                return
            }

            // 检查图片像素（不超过 6000x6000）
            const img = new Image()
            img.src = URL.createObjectURL(file)
            img.onload = async () => {
                const width = img.width
                const height = img.height
                if (width > 6000 || height > 6000) {
                    alert('图片像素不能超过 6000x6000')
                    return
                }

                // 如果图片大小超过 5MB，则进行压缩
                if (file.size > 5 * 1024 * 1024) {
                    try {
                        const compressedFile = await this.compressImage(file)
                        this.imageUrl = URL.createObjectURL(compressedFile)
                        this.imageBase64 = await this.fileToBase64(compressedFile)
                    } catch (error) {
                        console.error('图片压缩失败:', error)
                        alert('图片压缩失败，请重试')
                        return
                    }
                } else {
                    // 图片大小在 5MB 以内，直接处理
                    const reader = new FileReader()
                    reader.onload = e => {
                        this.imageUrl = e.target.result // 用于显示图片
                        this.imageBase64 = e.target.result.split(',')[1] // 提取 Base64 数据部分
                    }
                    reader.readAsDataURL(file)
                }
            }
        },
        // 压缩图片
        compressImage(file) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = URL.createObjectURL(file)
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')

                    // 设置最大宽度和高度
                    const maxWidth = 6000
                    const maxHeight = 6000
                    let width = img.width
                    let height = img.height

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height)
                        width *= ratio
                        height *= ratio
                    }

                    canvas.width = width
                    canvas.height = height

                    // 绘制图片到 canvas
                    ctx.drawImage(img, 0, 0, width, height)

                    // 将 canvas 转换为 Blob
                    canvas.toBlob(
                        blob => {
                            if (!blob) {
                                reject(new Error('图片压缩失败'))
                                return
                            }

                            // 检查压缩后的文件大小
                            if (blob.size > 5 * 1024 * 1024) {
                                // 如果仍然大于 5MB，降低质量
                                canvas.toBlob(
                                    newBlob => {
                                        if (!newBlob) {
                                            reject(new Error('图片压缩失败'))
                                            return
                                        }
                                        resolve(newBlob)
                                    },
                                    file.type,
                                    0.5 // 降低质量
                                )
                            } else {
                                resolve(blob)
                            }
                        },
                        file.type,
                        0.8 // 初始质量
                    )
                }
                img.onerror = error => reject(error)
            })
        },
        // 将文件转换为 Base64
        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = e => resolve(e.target.result.split(',')[1])
                reader.onerror = error => reject(error)
                reader.readAsDataURL(file)
            })
        },
        async startRecognition() {
            if (!this.imageBase64) {
                alert('请先上传图片')
                return
            }

            this.isLoading = true // 开始加载

            try {
                const messages = [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${this.imageBase64}` // 使用 Base64 格式的图片
                                }
                            },
                            {
                                type: 'text',
                                text: this.functions[this.selectedFunction].prompt
                            }
                        ]
                    }
                ]
                const { apiUrl, apiKey, modelName, temperature } = API_CONFIG['bigmodel']

                const stream = true
                // 用于存储流式响应的内容
                let streamContent = ''
                await fetchAIResponse(apiUrl, apiKey, modelName, messages, temperature, stream, chunk => {
                    // 逐步更新消息内容
                    if (chunk.type === 'content') {
                        streamContent += chunk.content
                        this.generatedContent = streamContent
                    }
                })
                // this.generatedContent = data.choices[0].message.content
            } catch (error) {
                console.error('Error fetching AI response:', error)
                this.generatedContent = '识别失败，请重试'
            } finally {
                this.isLoading = false // 结束加载
            }
        },

        // 打开分享弹窗
        openShareDialog() {
            this.isShareDialogOpen = true
        },

        // 关闭分享弹窗
        closeShareDialog() {
            this.isShareDialogOpen = false
        },

        // 保存分享内容到本地
        saveShareToLocal() {
            const postCardElement = document.querySelector('.post-card') // 获取 .post-card 元素
            if (!postCardElement) {
                alert('未找到分享内容')
                return
            }

            // 使用 html2canvas 生成图片
            html2canvas(postCardElement, {
                allowTaint: true, // 允许跨域
                useCORS: true, // 启用 CORS
                scale: 2, // 提高分辨率，避免模糊
                onclone: clonedDoc => {
                    // 在克隆的文档中调整图片样式，确保图片不会被拉伸
                    const clonedImg = clonedDoc.querySelector('.image-preview img')
                    if (clonedImg) {
                        // 确保图片保持比例
                        clonedImg.style.objectFit = 'cover'
                        clonedImg.style.width = '100%'
                        clonedImg.style.height = '100%'
                    }
                }
            })
                .then(canvas => {
                    // 将 canvas 转为 Data URL
                    const imageUrl = canvas.toDataURL('image/png')

                    // 创建一个下载链接并触发点击事件保存图片
                    const link = document.createElement('a')
                    link.href = imageUrl
                    link.download = 'pet-conversation.png' // 图片的默认保存名
                    link.click() // 模拟点击下载图片
                })
                .catch(error => {
                    console.error('生成图片失败:', error)
                    alert('生成图片失败，请重试')
                })
        }
    }
}
</script>
<style scoped>
.container {
    padding-bottom: 50px;
}
.head-title {
    font-size: 18px;
    margin-bottom: 10px;
}

.propup {
    z-index: 999;
}
.post-card {
    width: 100%;
    border-radius: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #fff;
}

.avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    background-color: blueviolet;
    background-image: linear-gradient(to top left, blueviolet, rgb(73, 31, 112));
}

.title {
    font-size: 20px;
    line-height: 22px;
    font-weight: 600;
    color: #000000;
    text-decoration: none;
    transition: all 0.35s ease-in;
}

.title:hover {
    text-decoration: underline blueviolet;
}

.datetime {
    font-size: 12px;
    color: rgb(168 179 207);
    margin: 10px 0;
}

.image-preview {
    flex: 1;
    width: 100%;
    border-radius: 20px;
    min-height: 200px;
}
.image-preview img {
    width: 100%;
    height: 300px;
    object-fit: over;
}
</style>
