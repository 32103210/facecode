# FaceCode Backend API

FaceCode 后端 API 服务，提供人脸变老和面相解析功能。

## 功能

- `/api/face/aging` - 调用极梦 API 生成人脸变老图片
- `/api/face/analyze` - 调用 OpenAI GPT-5 生成面相解析

## 安装

```bash
npm install
```

## 配置

复制 `env.example` 为 `.env` 并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```
PORT=3000
CORS_ORIGIN=http://localhost:8000
RATE_LIMIT_MAX=100
```

## 运行

### 生产模式
```bash
npm start
```

### 开发模式（自动重启）
```bash
npm run dev
```

## API 文档

### POST /api/face/aging

生成人脸变老图片

**请求体：**
```json
{
  "image": "data:image/jpeg;base64,...",
  "jimeng_api_key": "your_jimeng_api_key"
}
```

**响应：**
```json
{
  "ok": true,
  "original_image": "...",
  "aged_images": [
    { "age": "30岁", "url": "..." },
    { "age": "50岁", "url": "..." },
    { "age": "70岁", "url": "..." }
  ]
}
```

### POST /api/face/analyze

生成面相解析

**请求体：**
```json
{
  "image": "data:image/jpeg;base64,...",
  "openai_api_key": "your_openai_api_key"
}
```

**响应：**
```json
{
  "ok": true,
  "analysis": {
    "marriage": "姻缘方面的解析文字...",
    "career": "事业方面的解析文字...",
    "wealth": "财运方面的解析文字..."
  }
}
```

## 实现真实 API 调用

当前版本使用 Mock 数据。要实现真实 API 调用：

### 1. 极梦 API（agingController.js）

在 `controllers/agingController.js` 中实现真实的极梦 API 调用：

```javascript
const response = await axios.post('JIMENG_API_ENDPOINT', {
  image: image,
  // 其他参数根据极梦 API 文档
}, {
  headers: {
    'Authorization': `Bearer ${jimeng_api_key}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. OpenAI GPT-5 API（analysisController.js）

在 `controllers/analysisController.js` 中实现真实的 OpenAI API 调用：

```javascript
const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-4-vision-preview', // 或 gpt-5
  messages: [
    {
      role: 'system',
      content: '你是一位温柔且神秘的AI面相师...'
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: '...' },
        { type: 'image_url', image_url: { url: image } }
      ]
    }
  ]
}, {
  headers: {
    'Authorization': `Bearer ${openai_api_key}`,
    'Content-Type': 'application/json'
  }
});
```

## 部署

### Vercel
```bash
vercel
```

### Heroku
```bash
git push heroku main
```

### Docker
```bash
docker build -t facecode-backend .
docker run -p 3000:3000 facecode-backend
```

## 安全注意事项

- 实现请求限速
- 添加输入验证
- 实现内容审查
- 记录 API 调用日志
- 监控异常请求

## 许可证

MIT

