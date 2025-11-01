# 项目启动和测试指南

## 修复内容概述

已修复以下LLM调用问题：
1. ✅ 后端重复的catch块导致的错误处理混乱
2. ✅ API路由配置不匹配
3. ✅ 前端错误信息展示优化

详细修复说明请查看 `LLM_FIX.md`

## 快速启动

### 1. 启动后端服务

```bash
cd backend
npm install  # 首次运行需要安装依赖
npm start    # 启动服务器
```

服务器将在 http://localhost:3000 启动

### 2. 测试后端服务

在另一个终端窗口运行：

```bash
cd backend
node test-api.js
```

或者直接访问健康检查端点：
```bash
curl http://localhost:3000/health
```

预期输出：
```json
{"status":"ok","message":"FaceCode API is running"}
```

### 3. 启动前端服务

```bash
# 在项目根目录
python3 -m http.server 8000
# 或者
python -m SimpleHTTPServer 8000
```

### 4. 访问应用

在浏览器中打开：http://localhost:8000

## 测试流程

### 方式1: 使用Mock模式（无需API Key）

1. 编辑 `js/config.js`，设置：
   ```javascript
   MOCK_MODE: true
   ```

2. 访问应用，上传照片，系统将返回模拟数据

### 方式2: 使用真实OpenAI API

1. 编辑 `js/config.js`，设置：
   ```javascript
   MOCK_MODE: false
   ```

2. 访问应用，在设置页面输入你的OpenAI API Key

3. 上传人脸照片进行分析

## 常见问题排查

### 问题1: 后端启动失败

**症状**: `npm start` 报错

**解决方案**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### 问题2: API调用失败

**症状**: 前端显示"分析失败"

**检查清单**:
1. ✅ 后端服务是否正常运行？
   ```bash
   curl http://localhost:3000/health
   ```

2. ✅ 前端配置是否正确？
   - 检查 `js/config.js` 中的 `API_BASE_URL`
   - 应该是: `http://localhost:3000/api`

3. ✅ CORS是否配置正确？
   - 检查 `backend/.env` 中的 `CORS_ORIGIN`
   - 应该匹配前端地址（如 `http://localhost:8000`）

4. ✅ OpenAI API Key是否有效？
   - 在 https://platform.openai.com/api-keys 检查

### 问题3: OpenAI API返回错误

**常见错误**:

1. **401 Unauthorized**
   - API Key无效或过期
   - 解决：重新生成API Key

2. **429 Too Many Requests**
   - 超出速率限制
   - 解决：等待一段时间后重试

3. **500 Internal Server Error**
   - OpenAI服务问题
   - 解决：稍后重试

### 问题4: 图片上传失败

**检查**:
1. 图片大小是否超过限制（默认1MB）
2. 图片格式是否支持（JPG/PNG）
3. 浏览器控制台是否有错误信息

## 调试技巧

### 1. 查看后端日志

后端会输出详细的日志信息：
- ✅ 系统提示词加载成功
- 🔍 开始分析面相...
- 📸 图片大小
- ✅ OpenAI 返回内容
- ❌ 错误信息

### 2. 查看前端控制台

打开浏览器开发者工具（F12），查看Console标签：
- Session数据
- API调用结果
- 错误信息

### 3. 使用简化版结果页

编辑 `js/config.js`：
```javascript
USE_SIMPLE_RESULT: true
```

这样可以更容易调试结果显示问题。

## 性能优化建议

### 1. 调整超时时间

如果OpenAI API响应较慢，可以增加超时时间：

编辑 `js/config.js`：
```javascript
REQUEST_TIMEOUT: 60000  // 60秒
```

### 2. 调整重试次数

编辑 `js/config.js`：
```javascript
RETRY_TIMES: 3  // 重试3次
```

### 3. 使用更快的模型

编辑 `backend/controllers/analysisController.js`：
```javascript
model: 'gpt-4o-mini'  // 更快但可能质量稍低
```

## 下一步

修复完成后，建议：

1. ✅ 运行完整的端到端测试
2. ✅ 测试各种错误场景
3. ✅ 验证结果页面显示是否正常
4. ✅ 检查性能和响应时间

## 技术支持

如果遇到其他问题：
1. 查看 `LLM_FIX.md` 了解详细修复内容
2. 查看 `TROUBLESHOOTING.md` 了解更多故障排查方法
3. 检查浏览器控制台和后端日志






