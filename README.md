# DeepSeek Chat 项目

## 项目概述

DeepSeek Chat 是一个基于 Vue.js 的 AI 聊天应用，集成了多种大模型能力，具有良好的可扩展性。
本项目 90%的代码由大模型自主开发，构建工具：RooCline+DeepSeek+TailwindCSS。

## 在线演示

本项目部署在 Netlify 平台，可以直接访问:[https://irritable.netlify.app/](https://irritable.netlify.app/)

## 主要功能

### 核心功能

🤖 多模型

-   水泥封心：deepseek-v3
-   DeepSeek：deepseek-r1
-   Gemini：gemini-2.0-flash
-   GPT：gpt-3.5-turbo
-   智谱清言：glm-4v-flash
-   月之暗面：moonshot-v1-8k
-   零一万物：yi-lightning
-   通义千问：qwen-max
-   阶跃星辰：step-1-flash
-   百川智能：Baichuan4-Air
-   MINIMAX：MiniMax-Text-01
-   通义千问QwQ：QwQ-32B

🎭 角色对话

-   DeepSeek：deepseek-v3

🖼️ 图片识别/语音合成

-   阶跃星辰：step-1o-turbo-vision
-   阶跃星辰：step-tts-mini

😍 图片生成

-   智谱清言：cogview-3-flash


## 提示词管理

### 文件路径

`./src/utils/prompt.js`

提示词管理系统采用模块化设计，便于扩展和维护。每个提示词配置都经过精心设计，以确保与应用程序的功能和用户体验保持一致。

## 快速开始

### 开发环境配置

1. 安装 Node.js (>=16.0.0)
2. 克隆项目
    ```bash
    git clone https://github.com/liu-ziting/DeepSeekChat.git
    ```
3. 安装依赖
    ```bash
    npm install
    ```
4. 配置环境变量
   复制 `.env.example` 为 `.env` 并填写 API 密钥
5. 启动开发服务器
    ```bash
    npm run dev
    ```

### 使用 Netlify Functions 进行 API 请求

为了避免暴露 API 密钥，我们使用 Netlify Functions 来处理 API 请求。具体配置和 API 请求逻辑位于 `netlify/functions/chat.js`。

1. 确保你已经安装了 Netlify CLI
    ```bash
    npm install -g netlify-cli
    ```
2. 启动本地开发服务器
    ```bash
    netlify dev
    ```
   这将同时启动前端应用和 Netlify Functions。

3. 在代码中调用 Netlify Function
    ```javascript
    fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello, World!' }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

### 生产环境部署

1. 构建项目
    ```bash
    npm run build
    ```
2. 部署到 Netlify
    - 将项目推送到 GitHub 或其他支持的 Git 仓库。
    - 在 Netlify 控制台中，选择 "New site from Git"。
    - 选择你的仓库并按照提示完成部署。

3. 配置环境变量
    - 在 Netlify 控制台中，进入 "Site settings" > "Build & deploy" > "Environment"。
    - 添加你在 `.env` 文件中使用的环境变量。

现在，你的应用将通过 Netlify Functions 安全地处理 API 请求，避免暴露 API 密钥。


## API 文档

-   [DeepSeek API 文档](https://platform.deepseek.com/docs)
-   [Gemini API 文档](https://ai.google.dev/docs)
-   [智谱清言 API 文档](https://open.bigmodel.cn/dev/api)
-   [月之暗面 API 文档](https://platform.moonshot.cn/docs)
-   [零一万物 API 文档](https://platform.yilifang.com/docs)
-   [通义千问 API 文档](https://open.qwen.cn/docs)
-   [阶跃星辰 API 文档](https://platform.step.com/docs)
-   [百川智能 API 文档](https://open.baichuan.com.cn/docs)
-   [MINIMAX API 文档](https://platform.minimax.cn/docs)
