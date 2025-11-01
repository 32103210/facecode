# API 集成指南

## 概述

FaceCode 项目现已完整集成 OpenAI GPT-4 Vision API，使用增强的面相学知识库生成个性化的面相分析报告。

## 系统架构

```
用户上传图片
    ↓
前端 (js/api.js)
    ↓
后端 (backend/controllers/analysisController.js)
    ↓
加载系统提示词 (prompt/system_prompt.txt)
    ↓
调用 OpenAI GPT-4 Vision API
    ↓
返回 JSON 格式的分析结果
    ↓
前端展示 (result-simple.html)
```

## 核心文件说明

### 1. 系统提示词
**文件**: `prompt/system_prompt.txt`

这是发送给 OpenAI API 的完整系统提示词，包含：
- 道家面相学知识体系（105条特征）
- 三庭五官详解
- 十二宫系统
- 气色诊断系统
- 流年运势映射
- 个性化分析逻辑
- JSON 输出结构规范

### 2. 后端控制器
**文件**: `backend/controllers/analysisController.js`

关键功能：
```javascript
// 启动时自动加载系统提示词
const promptPath = path.join(__dirname, '../../prompt/system_prompt.txt');
SYSTEM_PROMPT = fs.readFileSync(promptPath, 'utf-8');

// 调用 OpenAI API
const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: SYSTEM_PROMPT  // 使用完整的系统提示词
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: '请根据这张人脸图片...' },
        { type: 'image_url', image_url: { url: image } }
      ]
    }
  ],
  max_tokens: 4000,
  temperature: 0.7
});
```

### 3. 前端 API 调用
**文件**: `js/api.js`

```javascript
// 支持 Mock 模式和真实 API 调用
API.callAnalysisAPI(imageBase64, openaiApiKey)
```

## 使用步骤

### 1. 启动后端服务

```bash
cd backend
npm install
npm start
```

服务将在 `http://localhost:3000` 启动。

### 2. 配置前端

在 `js/config.js` 中：

```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  MOCK_MODE: false,  // 设置为 false 使用真实 API
  // ...
};
```

### 3. 用户输入 API Key

用户在前端界面输入自己的 OpenAI API Key，系统会：
1. 将图片转换为 base64
2. 连同 API Key 一起发送到后端
3. 后端使用用户的 API Key 调用 OpenAI

### 4. 获取分析结果

API 返回的 JSON 格式：

```json
{
  "ok": true,
  "analysis": {
    "命运总览": {
      "标题": "气自成局·贵人天成",
      "内容": "你的面藏风水，气自成局...",
      "风格": "highlight"
    },
    "三庭分析": {
      "上庭": { ... },
      "中庭": { ... },
      "下庭": { ... }
    },
    "五官解读": {
      "额": { ... },
      "眉": { ... },
      "眼": { ... },
      "鼻": { ... },
      "唇": { ... }
    },
    "十二宫要点": [ ... ],
    "气色诊断": { ... },
    "流年运势": { ... },
    "综合气运": {
      "事业运": { ... },
      "财运": { ... },
      "情感运": { ... },
      "健康运": { ... }
    },
    "修炼建议": { ... },
    "传播金句": { ... }
  }
}
```

## 开发模式

### Mock 模式

在 `js/config.js` 中设置：
```javascript
MOCK_MODE: true
```

这样可以在没有 API Key 的情况下测试前端功能。

### 调试日志

后端会输出详细的日志：
- ✅ 系统提示词加载成功
- 🔍 开始分析面相...
- 📸 图片大小: xxx
- ✅ OpenAI 返回内容: ...
- ❌ 错误信息（如果有）

## API 配置

### OpenAI API 参数

在 `backend/controllers/analysisController.js` 中可以调整：

```javascript
{
  model: 'gpt-4o',           // 模型选择
  max_tokens: 4000,          // 最大返回长度
  temperature: 0.7           // 创造性（0-1）
}
```

**推荐配置**：
- `model`: `gpt-4o` 或 `gpt-4-vision-preview`
- `max_tokens`: 3000-5000（确保完整输出）
- `temperature`: 0.6-0.8（平衡准确性和创造性）

## 错误处理

### 常见错误

1. **API Key 无效**
   - 错误信息: "Invalid API key"
   - 解决方案: 检查用户输入的 API Key

2. **超出 Token 限制**
   - 错误信息: "Maximum context length exceeded"
   - 解决方案: 增加 `max_tokens` 或优化提示词

3. **图片格式错误**
   - 错误信息: "Invalid image format"
   - 解决方案: 确保图片是 base64 格式的 data URL

4. **JSON 解析失败**
   - 错误信息: "AI 返回的内容格式不正确"
   - 解决方案: 检查 AI 返回内容，可能需要调整提示词

### 错误处理流程

```javascript
try {
  // 调用 API
} catch (error) {
  if (error.response) {
    // OpenAI API 错误
    console.error('OpenAI API 错误:', error.response.data);
  } else {
    // 网络或其他错误
    console.error('请求失败:', error.message);
  }
  // 返回模拟数据（开发模式）
}
```

## 性能优化

### 1. 缓存策略

可以添加结果缓存：
```javascript
// 使用图片哈希作为缓存键
const imageHash = crypto.createHash('md5').update(image).digest('hex');
const cached = cache.get(imageHash);
if (cached) return cached;
```

### 2. 请求限流

防止频繁调用：
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10 // 最多10次请求
});
app.use('/api/face/analyze', limiter);
```

### 3. 图片压缩

在前端压缩图片：
```javascript
// 在 js/camera.js 中
canvas.toBlob((blob) => {
  // 压缩到合适大小
}, 'image/jpeg', 0.8);
```

## 成本估算

### OpenAI API 定价（参考）

- GPT-4o: ~$0.005 / 1K tokens
- 每次分析约消耗: 2000-4000 tokens
- 单次分析成本: ~$0.01-0.02

### 优化建议

1. 使用缓存减少重复请求
2. 在提示词中明确字数限制
3. 考虑使用 GPT-4o-mini（更便宜）

## 安全建议

### 1. API Key 保护

- ✅ 用户在前端输入，不存储在代码中
- ✅ 使用 HTTPS 传输
- ✅ 不在日志中记录 API Key

### 2. 输入验证

```javascript
// 验证图片大小
if (image.length > 10 * 1024 * 1024) {
  throw new Error('图片过大');
}

// 验证图片格式
if (!image.startsWith('data:image/')) {
  throw new Error('无效的图片格式');
}
```

### 3. 内容审查

```javascript
function sanitizeText(text) {
  // 过滤敏感词
  const forbiddenWords = ['死', '病', '灾', '祸'];
  // ...
}
```

## 测试

### 单元测试

```bash
cd backend
npm test
```

### API 测试

使用 Postman 或 curl：

```bash
curl -X POST http://localhost:3000/api/face/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,...",
    "openai_api_key": "sk-..."
  }'
```

## 故障排查

### 检查清单

1. ✅ 后端服务是否启动？
2. ✅ 系统提示词是否加载成功？
3. ✅ API Key 是否有效？
4. ✅ 网络连接是否正常？
5. ✅ 图片格式是否正确？
6. ✅ 前端配置是否正确（MOCK_MODE, API_BASE_URL）？

### 日志查看

**后端日志**：
```bash
cd backend
npm start
# 查看控制台输出
```

**前端日志**：
- 打开浏览器开发者工具
- 查看 Console 标签
- 查看 Network 标签（检查 API 请求）

## 更新日志

### 2025-10-19
- ✅ 集成完整的面相学知识库
- ✅ 创建系统提示词文件
- ✅ 更新后端 API 调用逻辑
- ✅ 添加 JSON 解析容错机制
- ✅ 完善错误处理

## 下一步计划

1. 添加结果缓存机制
2. 实现请求限流
3. 优化图片压缩
4. 添加用户反馈功能
5. 支持批量分析

## 联系支持

如有问题，请查看：
- `TROUBLESHOOTING.md` - 故障排查指南
- `README.md` - 项目概述
- GitHub Issues - 提交问题






