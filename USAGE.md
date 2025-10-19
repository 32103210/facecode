# FaceCode 使用说明

## 🎯 第一次使用

### 1. 启动项目

```bash
# 方式 1：使用启动脚本（推荐）
./start.sh

# 方式 2：手动启动
# 终端 1
cd backend && npm start

# 终端 2（新终端）
python -m http.server 8000
```

### 2. 访问应用

打开浏览器访问：**http://localhost:8000**

### 3. 配置 API Keys（可选）

当前项目运行在 **Mock 模式**，无需真实 API Keys 即可测试所有功能。

如果您有真实的 API Keys：
- 在首页输入极梦 API Key 和 OpenAI API Key
- 勾选"保存 API Key 到本地"
- 修改 `js/config.js` 中的 `MOCK_MODE` 为 `false`
- 在后端实现真实的 API 调用

## 📱 使用流程

### 步骤 1：首页 - 拍照或上传

1. **使用摄像头拍照**
   - 点击"使用摄像头"按钮
   - 允许浏览器访问摄像头
   - 调整角度，点击"拍照"
   - 预览照片，点击"确认并开始分析"

2. **上传照片**
   - 点击"上传照片"按钮
   - 选择一张正脸照片
   - 预览照片，点击"确认并开始分析"

### 步骤 2：加载页 - 等待分析

- 系统自动跳转到加载页
- 播放预加载视频
- 后台并行调用两个 API：
  - 极梦 API：生成变老图片
  - OpenAI API：生成面相解析
- 等待 API 返回结果（Mock 模式约 2-4 秒）

### 步骤 3：结果页 - 查看结果

1. **查看变老图片**
   - 左右滑动查看不同年龄段的照片
   - 点击左右箭头切换
   - 点击下方指示器快速跳转

2. **查看面相解析**
   - 姻缘：感情运势、婚姻状况
   - 事业：职场发展、领导力
   - 财运：财富运势、理财能力

3. **分享结果**
   - 点击"分享结果"按钮
   - 自动生成包含照片和解析的分享图
   - 图片自动下载到本地

4. **保存历史**
   - 点击"保存到历史"按钮
   - 结果保存到浏览器本地存储
   - 最多保存 10 条记录

5. **返回首页**
   - 点击"返回首页"按钮
   - 重新开始分析

## 🎨 自定义配置

### 更换背景视频

1. 准备 16:9 比例的 MP4 视频
2. 放入 `assets/videos/background.mp4`
3. 或修改 `js/config.js` 中的 `BACKGROUND_VIDEO` 路径

### 更换加载视频

1. 准备 MP4 视频（5-15 秒）
2. 放入 `assets/videos/loading.mp4`
3. 或修改 `js/config.js` 中的 `LOADING_VIDEO` 路径

### 更换结果页 UI 图片

1. 准备 1920x1080 的图片
2. 放入 `assets/images/result-ui.png`
3. 或修改 `js/config.js` 中的 `RESULT_UI_IMAGE` 路径

### 调整内容布局

编辑 `js/config.js` 中的 `RESULT_LAYOUT` 配置：

```javascript
RESULT_LAYOUT: {
  originalImage: { 
    top: '10%',    // 距离顶部的百分比
    left: '5%',    // 距离左侧的百分比
    width: '30%',  // 宽度百分比
    height: '40%'  // 高度百分比
  },
  // ... 其他区域配置
}
```

## 🔧 开发模式

### Mock 模式（当前）

- 位置：`js/config.js` 中 `MOCK_MODE: true`
- 特点：
  - 无需真实 API Keys
  - 返回模拟数据
  - 适合开发和演示
  - 变老图片使用原图
  - 面相解析使用预设文案

### 真实 API 模式

要切换到真实 API：

1. **前端配置**
   ```javascript
   // js/config.js
   MOCK_MODE: false
   ```

2. **后端实现**
   - 编辑 `backend/controllers/agingController.js`
   - 实现真实的极梦 API 调用
   - 编辑 `backend/controllers/analysisController.js`
   - 实现真实的 OpenAI API 调用

3. **使用真实 API Keys**
   - 在首页输入有效的 API Keys
   - 勾选"保存 API Key"

## 📊 数据存储

### localStorage 存储内容

1. **API Keys**
   - `jimeng_api_key`
   - `openai_api_key`

2. **历史记录**
   - `face_history`（数组，最多 10 条）
   - 包含：原图、变老图、解析文案、时间戳

### sessionStorage 存储内容

- `current_result`：当前分析结果
- 用于页面间数据传递

### 清除数据

在浏览器控制台执行：
```javascript
// 清除 API Keys
localStorage.removeItem('jimeng_api_key');
localStorage.removeItem('openai_api_key');

// 清除历史记录
localStorage.removeItem('face_history');

// 清除所有数据
localStorage.clear();
sessionStorage.clear();
```

## ⚙️ 高级配置

### 修改 API 端点

编辑 `js/config.js`：
```javascript
API_BASE_URL: 'https://your-api-domain.com/api'
```

### 修改图片大小限制

编辑 `js/config.js`：
```javascript
MAX_IMAGE_SIZE: 2 * 1024 * 1024  // 2MB
```

### 修改请求超时时间

编辑 `js/config.js`：
```javascript
REQUEST_TIMEOUT: 60000  // 60秒
```

### 修改重试次数

编辑 `js/config.js`：
```javascript
RETRY_TIMES: 3  // 重试3次
```

## 🐛 故障排除

### 问题：视频无法播放

**原因**：视频文件不存在或格式不正确

**解决**：
1. 检查视频文件是否存在
2. 确保视频格式为 MP4（H.264 编码）
3. 查看浏览器控制台错误信息

### 问题：摄像头无法访问

**原因**：浏览器权限或 HTTPS 要求

**解决**：
1. 允许浏览器访问摄像头
2. 使用 HTTPS 或 localhost
3. 使用上传照片功能作为替代

### 问题：API 调用失败

**原因**：后端未启动或网络问题

**解决**：
1. 确认后端服务正在运行
2. 检查 `js/config.js` 中的 API_BASE_URL
3. 查看浏览器控制台网络请求
4. 查看后端日志

### 问题：布局显示错误

**原因**：UI 图片未加载或配置错误

**解决**：
1. 确认 UI 图片文件存在
2. 检查 `RESULT_LAYOUT` 配置
3. 调整百分比数值
4. 查看浏览器控制台错误

### 问题：分享图片无法下载

**原因**：浏览器权限或跨域问题

**解决**：
1. 允许浏览器下载文件
2. 检查图片是否跨域
3. 使用同源图片

## 📱 移动端使用

### 触摸操作

- **轮播图**：左右滑动切换图片
- **按钮**：点击操作
- **滚动**：上下滑动查看内容

### 最佳实践

1. 使用竖屏模式
2. 确保网络连接稳定
3. 使用后置摄像头拍照
4. 保持光线充足

## 🎯 使用技巧

### 拍照技巧

1. 正面面对摄像头
2. 保持光线充足
3. 避免逆光
4. 表情自然
5. 距离适中

### 照片要求

- 格式：JPG、PNG
- 大小：< 10MB（会自动压缩）
- 内容：清晰的正脸照片
- 建议：高分辨率照片效果更好

## 📞 获取帮助

如遇问题，请查看：
1. [README.md](README.md) - 完整文档
2. [QUICKSTART.md](QUICKSTART.md) - 快速启动
3. [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - 项目概览
4. 浏览器控制台 - 错误信息
5. 后端日志 - API 调用情况

---

**祝您使用愉快！** 🎉

