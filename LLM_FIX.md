# LLM 调用问题修复说明

## 发现的问题

### 1. 重复的 catch 块导致错误处理混乱
**文件**: `backend/controllers/analysisController.js`

**问题描述**:
- 代码中存在两个嵌套的 `catch` 块（第86行和第140行）
- 第一个catch块在处理OpenAI API错误后返回mock数据
- 第二个catch块会再次捕获错误，导致响应被重复发送
- 这会造成 "Cannot set headers after they are sent to the client" 错误

**修复方案**:
- 移除了重复的catch块
- 统一错误处理逻辑：
  - OpenAI API错误 → 返回详细错误信息
  - 其他错误 → 返回通用错误信息
- 移除了mock数据返回逻辑（应该在前端CONFIG.MOCK_MODE控制）

### 2. 路由配置不匹配
**文件**: `backend/server.js` 和 `backend/routes/analysis.js`

**问题描述**:
- `server.js` 中路由挂载在 `/api/face/analyze`
- `routes/analysis.js` 中定义为 `router.post('/')`
- 这导致实际路径可能不匹配前端调用

**修复方案**:
- 修改 `server.js`: 路由挂载改为 `/api/face`
- 修改 `routes/analysis.js`: 路由定义改为 `/analyze`
- 最终路径: `POST /api/face/analyze` ✅

## 修复后的代码结构

### 错误处理流程
```javascript
try {
  // 1. 验证参数
  // 2. 调用 OpenAI API
  // 3. 解析 JSON 响应
  // 4. 返回成功结果
} catch (error) {
  // 统一错误处理
  if (error.response) {
    // OpenAI API 错误
    return res.status(error.response.status).json({...});
  }
  // 其他错误
  return res.status(500).json({...});
}
```

### 路由配置
```javascript
// server.js
app.use('/api/face', analysisRouter);

// routes/analysis.js
router.post('/analyze', analysisController.analyzeFace);

// 最终路径: POST /api/face/analyze
```

## 测试建议

### 1. 启动后端服务
```bash
cd backend
npm install
npm start
```

### 2. 测试健康检查
```bash
curl http://localhost:3000/health
```

### 3. 测试API调用
确保前端配置正确：
- `js/config.js` 中 `API_BASE_URL: 'http://localhost:3000/api'`
- `js/config.js` 中 `MOCK_MODE: false` (使用真实API)

### 4. 检查错误日志
- 查看浏览器控制台
- 查看后端服务器日志
- 确认没有 "headers already sent" 错误

## 其他注意事项

1. **OpenAI API Key**: 确保用户输入有效的API Key
2. **图片格式**: 确保图片是base64格式（data:image/...）
3. **超时设置**: 前端设置了30秒超时，OpenAI API可能需要更长时间
4. **CORS配置**: 确保后端CORS配置允许前端域名

## 相关文件

- ✅ `backend/controllers/analysisController.js` - 已修复（移除重复catch块）
- ✅ `backend/server.js` - 已修复（修正路由挂载）
- ✅ `backend/routes/analysis.js` - 已修复（修正路由定义）
- ✅ `js/api.js` - 已优化（增强错误处理）
- ⚠️ `js/config.js` - 需要根据需要调整MOCK_MODE

## 修复总结

### 主要问题
1. **重复的错误处理** - 导致响应被多次发送
2. **路由配置错误** - 导致API路径不匹配

### 修复内容
1. 统一后端错误处理逻辑
2. 修正API路由配置
3. 增强前端错误信息展示

### 预期效果
- ✅ 不再出现 "Cannot set headers after they are sent" 错误
- ✅ API调用路径正确匹配
- ✅ 错误信息更加详细和友好
- ✅ OpenAI API错误能够正确传递到前端

