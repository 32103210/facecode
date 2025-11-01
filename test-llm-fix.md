# LLM修复测试指南

## 快速测试步骤

### 1. 测试Mock模式（无需API Key）

```bash
# 1. 确认配置
# 编辑 js/config.js，确认：
MOCK_MODE: true
DEBUG_MODE: false
```

打开浏览器访问 http://localhost:8000
- 上传照片
- 等待2秒（模拟延迟）
- 应该看到result-simple.html显示模拟数据

**验证点**：
- ✅ 命运总览显示正确
- ✅ 五官解读显示5个部位（额、眉、眼、鼻、唇）
- ✅ 气运分析显示正确
- ✅ 修炼建议显示正确
- ✅ "谁能旺你"标签页可以打开

### 2. 测试真实API（需要OpenAI API Key）

```bash
# 1. 修改配置
# 编辑 js/config.js：
MOCK_MODE: false
DEBUG_MODE: true  # 启用调试

# 2. 启动后端
cd backend
npm start

# 3. 启动前端（新终端）
cd ..
python3 -m http.server 8000
```

**测试流程**：
1. 访问 http://localhost:8000
2. 在设置页输入有效的OpenAI API Key
3. 勾选"保存API Key"
4. 上传人脸照片
5. 等待LLM分析（通常需要10-30秒）

**控制台检查**：
打开浏览器开发者工具（F12），应该看到：

```
✅ 简化版系统提示词加载成功
🔍 开始分析面相...
📸 图片大小: xxxxxx
✅ OpenAI 返回内容（前500字符）: {...
📏 返回内容总长度: xxxx
📝 检测到markdown代码块，已提取  // 如果LLM返回了markdown
✅ JSON 解析成功
✅ 所有必需字段验证通过
✅ 数据结构验证通过
API 调用结果: {ok: true, analysis: {...}}
```

**后端日志检查**：
在后端终端应该看到：

```
✅ 简化版系统提示词加载成功
🔍 开始分析面相...
📸 图片大小: xxxxxx
✅ OpenAI 返回内容（前500字符）: ...
📏 返回内容总长度: xxxx
✅ JSON 解析成功
✅ 所有必需字段验证通过
```

### 3. 调试模式测试

```javascript
// js/config.js
DEBUG_MODE: true
```

重新测试后，在浏览器控制台：

```javascript
// 查看保存的API响应
console.log(JSON.parse(localStorage.getItem('last_api_response')))

// 应该输出完整的JSON结构：
// {
//   ok: true,
//   analysis: {
//     命运总览: { 内容: "..." },
//     五官解读: { 额: {...}, 眉: {...}, ... },
//     ...
//   }
// }
```

### 4. 错误场景测试

**测试A：无效的API Key**
1. 输入无效的API Key（如：`sk-invalid123`）
2. 上传照片
3. 应该看到错误提示："分析失败: Incorrect API key provided..."

**测试B：网络中断**
1. 关闭后端服务
2. 上传照片
3. 应该看到错误提示："分析失败: Failed to fetch"

**测试C：超时**
```javascript
// js/config.js
REQUEST_TIMEOUT: 1000  // 1秒（故意设置很短）
```
应该看到超时错误

## 验证result-simple.html显示

访问结果页后，点击各个标签页验证：

### 命运总览（顶部大卡片）
- ✅ 显示40-60字的命运概述
- ✅ 紫色渐变背景
- ✅ 白色文字

### 五官解读（点击"五官解读"按钮）
- ✅ 额：显示描述和典籍（如果有）
- ✅ 眉：显示描述
- ✅ 眼：显示描述
- ✅ 鼻：显示描述和典籍（如果有）
- ✅ 唇：显示描述
- ✅ 每个卡片有对应的颜色标识

### 气运分析（点击"气运分析"按钮）
- ✅ 显示50-80字的运势分析
- ✅ 单独一个卡片显示

### 修炼建议（点击"修炼建议"按钮）
- ✅ 显示50-80字的调理建议
- ✅ 单独一个卡片显示

### 谁能旺你（点击"谁能旺你"按钮）
- ✅ 显示照片
- ✅ 显示社交配对内容
- ✅ 显示小程序码

## 常见问题排查

### 问题1：后端启动失败
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### 问题2：Prompt文件加载失败
检查后端日志，如果看到：
```
⚠️ 无法加载系统提示词，使用默认提示词
```

解决：
```bash
# 确认文件存在
ls prompt/simple_system_prompt.txt
```

### 问题3：JSON解析失败
启用DEBUG_MODE，查看原始返回：
```javascript
localStorage.getItem('last_api_response')
```

如果看到不是JSON格式，可能需要：
- 检查API Key是否有效
- 检查prompt是否正确
- 尝试降低temperature参数

### 问题4：字段缺失
后端会明确提示缺少哪个字段：
```
❌ JSON 解析或验证失败: 缺少必需字段: 命运总览
❌ JSON 解析或验证失败: 五官解读缺少部位: 眉, 鼻
```

解决：
1. 确认simple_system_prompt.txt正确加载
2. 尝试增加max_tokens
3. 检查OpenAI API状态

## 性能基准

正常情况下的响应时间：

- **Mock模式**：2秒（固定延迟）
- **真实API (gpt-4o)**：10-30秒
- **真实API (gpt-4o-mini)**：5-15秒

如果超过这些时间：
1. 检查网络连接
2. 检查OpenAI API状态
3. 考虑增加REQUEST_TIMEOUT

## 成功标准

全部通过即表示修复成功：

- [ ] Mock模式正常工作
- [ ] 真实API返回正确的JSON结构
- [ ] 所有5个板块内容正确显示
- [ ] 错误信息清晰明确
- [ ] 调试模式可以查看原始响应
- [ ] 后端日志输出详细清晰
- [ ] 没有控制台错误

## 下一步

测试通过后：
1. 关闭调试模式：`DEBUG_MODE: false`
2. 使用真实API：`MOCK_MODE: false`
3. 正常使用应用

## 调试技巧

### 查看完整的Prompt
```javascript
// 在后端添加日志
console.log('System Prompt:', SYSTEM_PROMPT);
```

### 查看LLM完整返回
```javascript
// 后端已经输出前500字符
// 如需查看完整内容，临时修改：
console.log('✅ OpenAI 返回完整内容:', content);
```

### 测试JSON解析
```javascript
// 在浏览器控制台测试
const testContent = '```json\n{"命运总览": {"内容": "test"}}\n```';
// 复制parseAIResponse函数到控制台测试
```

---

测试遇到问题？
1. 查看 LLM_FIX_COMPLETE.md
2. 检查浏览器控制台
3. 检查后端日志
4. 查看localStorage调试信息





