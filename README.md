# DeepSeek Chat

DeepSeek Chat 是一款基于 Vue.js 开发的聊天应用前端项目，所有代码均由 DeepSeek AI 自主构建并进行了定制化修改。目前，DeepSeek 支持与 Gemini 模型的集成，并提供三种不同的语言模式供用户选择。

## 技术栈

-   Vue 3
-   Vue Router
-   Tailwind CSS
-   PostCSS
-   Babel

## 项目结构

```
.
├── public/              # 静态资源
│   ├── face.ico         # 网站图标
│   └── index.html       # 主HTML文件
├── src/                 # 源代码
│   ├── assets/          # 图片资源
│   ├── components/      # Vue组件
│   │   ├── ChatBox/     # 聊天框相关组件
│   │   ├── IconBox/     # 图标组件
│   │   ├── ChatBox.vue  # 主聊天框
│   │   ├── ModelSelector.vue  # 模型选择器
│   │   └── ModeSelector.vue   # 模式选择器
│   ├── router/          # 路由配置
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   ├── index.css        # 全局样式
│   └── main.js          # 入口文件
├── .env                 # 环境变量
├── .gitignore           # Git忽略文件
├── babel.config.js      # Babel配置
├── jsconfig.json        # JS配置
├── package.json         # 项目依赖
├── postcss.config.js    # PostCSS配置
├── tailwind.config.js   # Tailwind配置
└── vue.config.js        # Vue CLI配置
```

## 快速开始

1. 克隆仓库

```bash
git clone https://github.com/your-repo/deepseek-chat.git
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量
   复制 `.env.example` 为 `.env` 并填写相关配置

4. 运行开发服务器

```bash
npm run serve
```

5. 构建生产版本

```bash
npm run build
```

## 环境变量

| 变量名                   | 说明         |
| ------------------------ | ------------ |
| VUE_APP_DEEPSEEK_API_KEY | DeepSeek Key |
| VUE_APP_GEMINI_API_KEY   | Gemini Key   |

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)

