# 🚀 快速启动指南 - API 集成版

## 5 分钟快速开始

### 步骤 1: 启动后端服务

```bash
cd backend
npm install
npm start
```

**期望输出**：
```
✅ 系统提示词加载成功
FaceCode backend server is running on port 3000
Health check: http://localhost:3000/health
```

如果看到 "✅ 系统提示词加载成功"，说明一切正常！

---

### 步骤 2: 启动前端服务

**新开一个终端窗口**：

```bash
# 在项目根目录
python3 -m http.server 8000
```

或使用启动脚本：
```bash
./start.sh
```

---

### 步骤 3: 选择模式

#### 选项 A: 开发模式（无需 API Key）

编辑 `js/config.js`：
```javascript
const CONFIG = {
  MOCK_MODE: true,  // 使用模拟数据
  USE_SIMPLE_RESULT: true
};
```

**优点**：
- ✅ 无需 API Key
- ✅ 快速测试
- ✅ 无成本

**缺点**：
- ❌ 固定的模拟数据
- ❌ 无法测试真实 AI

#### 选项 B: 生产模式（需要 API Key）

编辑 `js/config.js`：
```javascript
const CONFIG = {
  MOCK_MODE: false,  // 使用真实 API
  API_BASE_URL: 'http://localhost:3000/api',
  USE_SIMPLE_RESULT: true
};
```

**获取 API Key**：
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录账号
3. 点击 "Create new secret key"
4. 复制 API Key（格式：`sk-...`）

**配置 API Key**：
- 方式 1: 访问 `http://localhost:8000/settings.html` 输入
- 方式 2: 浏览器控制台执行：
  ```javascript
  localStorage.setItem('openai_api_key', 'sk-your-key-here');
  ```

---

### 步骤 4: 测试

访问测试页面：
```
http://localhost:8000/test-api-integration.html
```

**测试步骤**：
1. 输入 API Key（如果使用生产模式）
2. 点击 "运行所有测试"
3. 查看测试结果

**期望结果**：
- ✅ 后端健康检查：通过
- ✅ 系统提示词加载：通过
- ✅ Mock 模式测试：通过
- ✅ 真实 API 调用：通过（需要 API Key）
- ✅ JSON 格式验证：通过

---

### 步骤 5: 开始使用

访问应用：
```
http://localhost:8000/welcome.html
```

**使用流程**：
1. 点击"开始体验"
2. 拍照或上传照片
3. 等待分析（Mock 模式 2 秒，真实 API 5-10 秒）
4. 查看完整的面相分析报告

---

## 常见问题

### Q1: 后端启动失败？

**检查**：
```bash
cd backend
npm install  # 确保依赖安装完整
node -v      # 检查 Node.js 版本（需要 v14+）
```

### Q2: 看不到 "✅ 系统提示词加载成功"？

**检查**：
1. 文件是否存在：`prompt/system_prompt.txt`
2. 文件路径是否正确
3. 查看完整的错误信息

### Q3: API 调用失败？

**检查**：
1. API Key 是否正确（以 `sk-` 开头）
2. OpenAI 账户是否有余额
3. 网络连接是否正常
4. 查看浏览器控制台和后端日志

### Q4: 结果页面不显示？

**检查**：
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 查看 Network 标签的 API 请求
4. 使用测试页面验证

### Q5: Mock 模式和真实 API 如何切换？

编辑 `js/config.js`：
```javascript
MOCK_MODE: true   // Mock 模式
MOCK_MODE: false  // 真实 API
```

刷新页面即可生效。

---

## 调试技巧

### 1. 查看后端日志

后端会输出详细日志：
```
✅ 系统提示词加载成功
🔍 开始分析面相...
📸 图片大小: 12345
✅ OpenAI 返回内容: {...
```

### 2. 查看前端日志

打开浏览器开发者工具（F12）：
- **Console** 标签：查看 JavaScript 日志
- **Network** 标签：查看 API 请求和响应

### 3. 使用测试工具

访问 `test-api-integration.html`，可以：
- 测试各个组件
- 查看详细日志
- 验证 JSON 格式

---

## 性能优化

### 1. 图片大小

建议图片大小：
- 宽度：800-1200px
- 文件大小：< 2MB
- 格式：JPEG 或 PNG

### 2. API 参数调整

编辑 `backend/controllers/analysisController.js`：
```javascript
{
  model: 'gpt-4o',        // 或 'gpt-4o-mini'（更便宜）
  max_tokens: 4000,       // 减少可降低成本
  temperature: 0.7        // 0.5-0.9 之间调整
}
```

### 3. 缓存结果

可以添加缓存避免重复分析同一张图片。

---

## 成本控制

### OpenAI API 定价

- **GPT-4o**: ~$0.005 / 1K tokens
- **单次分析**: 约 2000-4000 tokens
- **成本**: ~$0.01-0.02 / 次

### 节省成本的方法

1. **使用 GPT-4o-mini**（更便宜）
2. **添加缓存**（避免重复请求）
3. **限制 max_tokens**（减少输出长度）
4. **开发时使用 Mock 模式**（完全免费）

---

## 下一步

### 学习更多

- 📖 [API 集成指南](API_INTEGRATION_GUIDE.md) - 详细的技术文档
- 📖 [README](README.md) - 项目概述
- 📖 [故障排查](TROUBLESHOOTING.md) - 问题解决

### 自定义

- 🎨 修改 `prompt/system_prompt.txt` - 自定义分析风格
- 🎨 修改 `css/` 文件 - 自定义界面样式
- 🎨 修改 `js/config.js` - 调整配置参数

### 部署

准备部署到生产环境？查看：
- 🚀 部署指南（待创建）
- 🔒 安全最佳实践
- 📊 性能监控

---

## 获取帮助

### 遇到问题？

1. 查看 [故障排查文档](TROUBLESHOOTING.md)
2. 使用测试工具诊断问题
3. 查看后端和前端日志
4. 提交 GitHub Issue

### 需要功能？

欢迎提交功能请求和改进建议！

---

## 快速命令参考

```bash
# 启动后端
cd backend && npm start

# 启动前端
python3 -m http.server 8000

# 一键启动（Mac/Linux）
./start.sh

# 测试 API
curl http://localhost:3000/health

# 查看日志
# 后端：查看终端输出
# 前端：浏览器 F12 -> Console
```

---

🎉 **祝你使用愉快！**

如有问题，请查看详细文档或提交 Issue。

