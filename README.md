# FaceCode｜面码 - HTML5 Web 应用 MVP

基于人脸变老生成和 AI 面相解析的玄学风格 Web 应用。

## 功能特性

- 📸 支持上传照片或摄像头拍照
- 👴 使用极梦 API 生成人脸变老状态图（多个年龄段）
- 🔮 使用 GPT-5 生成面相解析（姻缘、事业、财运）
- 🎨 生成精美分享卡片
- 📱 响应式设计，支持桌面和移动端
- 💾 本地历史记录保存
- 🔑 支持用户自定义 API Key

## 项目结构

```
facecode/
├── index.html              # 主页面（上传/拍照 + API Key 配置，视频底图）
├── loading.html            # 加载页面（预加载视频全屏播放，等待 API 结果）
├── result.html             # 结果展示页面（使用 UI 框架图片，叠加内容）
├── css/                    # 样式文件
│   ├── style.css          # 主样式
│   ├── loading.css        # 加载页样式
│   ├── carousel.css       # 轮播图样式
│   ├── result-layout.css  # 结果页布局样式
│   └── responsive.css     # 响应式样式
├── js/                     # JavaScript 模块
│   ├── config.js          # 配置文件（API 端点、视频/图片路径、布局配置等）
│   ├── api.js             # API 调用模块
│   ├── camera.js          # 摄像头功能模块
│   ├── canvas.js          # Canvas 绘图模块
│   ├── carousel.js        # 图片轮播组件
│   ├── loading.js         # 加载页逻辑（视频控制、API 调用）
│   ├── result.js          # 结果页逻辑（布局渲染、数据展示）
│   ├── storage.js         # localStorage 管理（API Key + 历史记录）
│   └── main.js            # 主逻辑
├── assets/                 # 资源文件
│   ├── videos/
│   │   ├── background.mp4 # 首页背景视频（16:9 比例）
│   │   └── loading.mp4    # 加载页预加载视频
│   ├── images/
│   │   └── result-ui.png  # 结果页 UI 框架图片
│   └── fonts/             # 字体文件
├── backend/                # 后端服务
│   ├── server.js          # Express 服务器
│   ├── routes/            # 路由
│   ├── controllers/       # 控制器
│   └── package.json       # 依赖配置
└── README.md              # 项目说明
```

## 快速开始

### 前端运行

1. **克隆或下载项目**

2. **配置 API 端点**
   编辑 `js/config.js`，设置后端 API 地址：
   ```javascript
   API_BASE_URL: 'http://localhost:3000/api'
   ```

3. **准备资源文件**
   - 将首页背景视频放入 `assets/videos/background.mp4`
   - 将加载页视频放入 `assets/videos/loading.mp4`
   - 将结果页 UI 图片放入 `assets/images/result-ui.png`
   
   详见各目录下的 README 文件。

4. **启动本地服务器**
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:8000`

6. **输入 API Keys**
   在界面中输入您的极梦 API Key 和 OpenAI API Key

### 后端部署

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   复制 `env.example` 为 `.env` 并配置：
   ```bash
   cp env.example .env
   ```
   
   编辑 `.env` 文件：
   ```
   PORT=3000
   CORS_ORIGIN=http://localhost:8000
   ```

4. **启动服务器**
   ```bash
   # 生产模式
   npm start
   
   # 开发模式（自动重启）
   npm run dev
   ```

5. **验证服务**
   访问 `http://localhost:3000/health` 检查服务状态

## API Key 获取

### 极梦 API Key
访问极梦官网注册并获取 API Key

### OpenAI API Key
访问 OpenAI 官网注册并获取 API Key（需要支持 GPT-5 和 Vision 功能）

## 自定义资源配置

### 替换首页背景视频

1. 准备 16:9 比例的 MP4 视频文件（建议 1920x1080，< 5MB）
2. 将视频文件放入 `assets/videos/` 目录，命名为 `background.mp4`
3. 或修改 `js/config.js` 中的 `BACKGROUND_VIDEO` 配置项指向新文件
4. 刷新页面查看效果

### 替换加载页预加载视频

1. 准备预加载视频 MP4 文件（建议 1920x1080，< 10MB，5-15秒）
2. 将视频文件放入 `assets/videos/` 目录，命名为 `loading.mp4`
3. 或修改 `js/config.js` 中的 `LOADING_VIDEO` 配置项
4. 测试拍照后的加载流程

### 替换结果页 UI 框架图片

1. 准备 UI 框架图片（PNG/JPG，建议 1920x1080，< 1MB）
2. 将图片文件放入 `assets/images/` 目录，命名为 `result-ui.png`
3. 或修改 `js/config.js` 中的 `RESULT_UI_IMAGE` 配置项
4. 根据新 UI 图片调整 `RESULT_LAYOUT` 配置中的位置参数
5. 刷新结果页查看效果

### 调整结果页内容布局

在 `js/config.js` 中修改 `RESULT_LAYOUT` 配置项：

```javascript
RESULT_LAYOUT: {
  originalImage: { top: '10%', left: '5%', width: '30%', height: '40%' },
  agedImagesCarousel: { top: '10%', left: '40%', width: '55%', height: '40%' },
  marriageText: { top: '55%', left: '5%', width: '28%', height: 'auto', fontSize: '14px', color: '#333' },
  careerText: { top: '55%', left: '36%', width: '28%', height: 'auto', fontSize: '14px', color: '#333' },
  wealthText: { top: '55%', left: '67%', width: '28%', height: 'auto', fontSize: '14px', color: '#333' }
}
```

- 使用百分比单位相对于 UI 图片容器定位
- 可调整 `top`、`left`、`width`、`height` 控制位置和大小
- 可调整 `fontSize`、`color` 等样式属性

## 开发模式

项目默认启用 Mock 模式（`CONFIG.MOCK_MODE = true`），无需真实 API Key 即可测试。

要切换到真实 API 模式：
1. 编辑 `js/config.js`，设置 `MOCK_MODE: false`
2. 在后端 `controllers` 中实现真实的 API 调用逻辑
3. 输入有效的 API Keys

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **后端**：Node.js + Express
- **AI 服务**：极梦 API (人脸变老) + OpenAI GPT-5 (面相解析)

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 移动端浏览器（iOS Safari, Chrome Mobile）

## 注意事项

1. **HTTPS 要求**：摄像头功能需要 HTTPS 或 localhost 环境
2. **API Key 安全**：API Keys 仅保存在用户本地浏览器，不会上传到服务器
3. **图片大小**：上传图片会自动压缩到 1MB 以内
4. **隐私保护**：所有图片处理仅在会话期间进行，不做长期保存

## 常见问题

### 无法访问摄像头？
- 检查浏览器权限设置
- 确保使用 HTTPS 或 localhost
- 可以使用上传照片功能作为替代

### 视频无法播放？
- 检查视频文件格式（需要 MP4/H.264）
- 确保视频文件路径正确
- 检查浏览器控制台是否有错误信息

### API 调用失败？
- 检查后端服务是否正常运行
- 验证 API Keys 是否有效
- 查看浏览器控制台和后端日志

### 布局显示不正确？
- 检查 `RESULT_LAYOUT` 配置是否正确
- 确保 UI 框架图片已正确加载
- 尝试调整百分比数值

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。

---

&copy; 2025 FaceCode. All rights reserved.

