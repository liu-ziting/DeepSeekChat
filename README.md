# DeepSeek Chat 项目

## 项目概述

DeepSeek Chat 是一个基于 Vue.js 的 AI 聊天应用，集成了多种大模型能力，提供智能对话和宠物心理分析功能。项目采用模块化设计，具有良好的可扩展性。

### 项目背景

随着大语言模型的快速发展，AI 对话系统在各个领域得到广泛应用。本项目旨在构建一个轻量级、易扩展的 AI 对话平台，集成多种主流大模型，为用户提供智能对话服务。同时，结合计算机视觉技术，创新性地加入了宠物心理分析功能，为宠物主人提供有趣的互动体验。

## 在线演示

本项目部署在 Netlify 平台，可以直接访问:[https://irritable.netlify.app/](https://irritable.netlify.app/)

## 主要功能

### 核心功能

-   多模型对话：支持 DeepSeek、Gemini、智谱清言、月之暗面等主流大模型
-   宠物心理分析：通过上传宠物照片，AI 分析宠物情绪并生成拟人化描述
-   响应式设计：适配桌面和移动端

### 技术特性

-   图片处理：支持图片压缩、格式转换、Base64 编码
-   状态管理：Vue 响应式状态管理
-   错误处理：完善的错误捕获和用户提示
-   性能优化：图片懒加载、请求节流

## 技术栈

### 核心框架

-   Vue 2
-   Vue Router
-   Vuex (状态管理)

### UI 组件库

-   Tailwind CSS
-   自定义图标组件

### 构建工具

-   Vite
-   Babel
-   PostCSS

### 代码质量

-   ESLint
-   Prettier
-   Stylelint

## 项目结构

```
DeepSeekChat/
├── public/                # 静态资源
│   └── face.ico           # 网站图标
├── src/                   # 源代码
│   ├── assets/            # 静态资源
│   │   ├── ai.png         # AI 图标
│   │   ├── face.png       # 头像
│   │   └── logo.png       # 项目logo
│   ├── components/        # 组件
│   │   ├── ChatBox/       # 聊天相关组件
│   │   │   ├── InputBox.vue  # 输入框组件
│   │   │   └── MessageBox.vue # 消息展示组件
│   │   ├── IconBox/       # 图标组件
│   │   │   ├── IconAI.vue    # AI 图标
│   │   │   ├── IconGlm.vue   # 智谱图标
│   │   │   └── IconPic.vue   # 图片图标
│   │   ├── ImgBox/        # 图片处理组件
│   │   │   └── Glm4V.vue     # 图片上传与分析组件
│   │   ├── ModelSelector.vue # 模型选择器
│   │   └── ModeSelector.vue  # 模式选择器
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由配置
│   ├── utils/             # 工具函数
│   │   ├── api.js         # API 请求封装
│   │   └── helpers.js     # 工具函数
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── .env                   # 环境变量
├── tailwind.config.js     # Tailwind 配置
├── vue.config.js          # Vue 配置
└── package.json           # 项目依赖
```

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

### 生产环境部署

1. 构建项目
    ```bash
    npm run build
    ```
2. 部署到服务器
    ```bash
    scp -r dist/ user@server:/path/to/deploy
    ```

## API 文档

-   [DeepSeek API 文档](https://platform.deepseek.com/docs)
-   [Gemini API 文档](https://ai.google.dev/docs)
-   [智谱清言 API 文档](https://open.bigmodel.cn/dev/api)
-   [月之暗面 API 文档](https://platform.moonshot.cn/docs)
