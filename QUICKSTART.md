# FaceCode 快速启动指南

## 🚀 5 分钟快速上手

### 步骤 1：准备资源文件

由于版权原因，项目不包含视频和图片资源，您需要自己准备：

1. **首页背景视频** (`assets/videos/background.mp4`)
   - 16:9 比例的 MP4 视频
   - 建议大小 < 5MB
   - 或使用纯色背景临时替代

2. **加载页视频** (`assets/videos/loading.mp4`)
   - MP4 视频，5-15 秒
   - 建议大小 < 10MB
   - 或复制 background.mp4

3. **结果页 UI 图片** (`assets/images/result-ui.png`)
   - 1920x1080 的图片
   - 建议大小 < 1MB
   - 或使用纯色背景临时替代

**临时方案**：如果暂时没有资源文件，可以创建空白文件占位：
```bash
# 创建占位文件（仅用于测试）
touch assets/videos/background.mp4
touch assets/videos/loading.mp4
touch assets/images/result-ui.png
```

### 步骤 2：一键启动

```bash
# 给启动脚本添加执行权限（首次需要）
chmod +x start.sh

# 启动项目
./start.sh
```

启动脚本会自动：
- 安装后端依赖
- 启动后端服务（端口 3000）
- 启动前端服务（端口 8000）

### 步骤 3：访问应用

打开浏览器访问：**http://localhost:8000**

### 步骤 4：使用应用

1. **输入 API Keys**（可选，Mock 模式下不需要）
   - 极梦 API Key
   - OpenAI API Key
   - 勾选"保存 API Key"以便下次使用

2. **拍照或上传照片**
   - 点击"使用摄像头"拍照
   - 或点击"上传照片"选择文件

3. **等待分析**
   - 系统会自动跳转到加载页
   - 播放预加载视频
   - 并行调用 API 生成结果

4. **查看结果**
   - 自动跳转到结果页
   - 查看变老图片（可左右滑动）
   - 查看面相解析（姻缘、事业、财运）

5. **分享或保存**
   - 点击"分享结果"下载分享图片
   - 点击"保存到历史"保存记录
   - 点击"返回首页"重新开始

## 🔧 手动启动（备选方案）

如果启动脚本无法使用，可以手动启动：

### 启动后端
```bash
cd backend
npm install
npm start
```

### 启动前端（新终端）
```bash
# 使用 Python
python -m http.server 8000

# 或使用 npx
npx serve
```

## 📝 开发模式说明

### Mock 模式（默认）

项目默认启用 Mock 模式，无需真实 API Key 即可测试：

- 在 `js/config.js` 中 `MOCK_MODE: true`
- 会返回模拟数据
- 适合开发和演示

### 真实 API 模式

要使用真实 API：

1. 编辑 `js/config.js`，设置 `MOCK_MODE: false`
2. 在后端实现真实 API 调用（见 `backend/controllers/`）
3. 输入有效的 API Keys

## 🎨 自定义配置

### 修改布局

编辑 `js/config.js` 中的 `RESULT_LAYOUT` 配置：

```javascript
RESULT_LAYOUT: {
  originalImage: { top: '10%', left: '5%', width: '30%', height: '40%' },
  // ... 其他配置
}
```

### 修改样式

- 主样式：`css/style.css`
- 加载页：`css/loading.css`
- 结果页：`css/result-layout.css`
- 响应式：`css/responsive.css`

## ❓ 常见问题

### Q: 视频无法播放？
A: 确保视频文件存在且格式正确（MP4/H.264）

### Q: 摄像头无法访问？
A: 需要 HTTPS 或 localhost 环境，或使用上传照片功能

### Q: 后端启动失败？
A: 检查端口 3000 是否被占用，或修改 `backend/.env` 中的 PORT

### Q: 页面布局错乱？
A: 检查 UI 图片是否正确加载，调整 `RESULT_LAYOUT` 配置

## 📚 更多信息

- 完整文档：[README.md](README.md)
- 后端文档：[backend/README.md](backend/README.md)
- 资源说明：
  - [assets/videos/README.md](assets/videos/README.md)
  - [assets/images/README.md](assets/images/README.md)

## 🎉 开始使用

现在您可以开始使用 FaceCode 了！

```bash
./start.sh
```

然后访问 http://localhost:8000

祝您使用愉快！ 🚀

