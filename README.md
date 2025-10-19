# FaceCode｜面码

AI 面相解析应用 - 运用人工智能技术解读面相奥秘

## 功能特性

- 🔮 **完整面相分析** - 基于道家面相学知识库，生成个性化分析报告
- 📊 **三庭五官解读** - 详细分析上中下三庭、五官特征
- 🎯 **十二宫要点** - 解读命宫、财帛宫等十二宫位
- 🌈 **气色诊断** - 五行气色分析，预测短期运势
- 📅 **流年运势** - 关键年龄节点提醒（41岁、48岁等）
- ⭐ **综合气运** - 事业、财运、情感、健康四维度评分
- 💡 **修炼建议** - 道家养生与趋吉避凶指导
- 📱 **传播金句** - 个性化、易传播的命运金句

## 核心技术

### AI 模型
- **OpenAI GPT-4o Vision** - 图像识别 + 文本生成
- **完整知识库** - 105条面相特征 + 推理逻辑框架
- **个性化引擎** - 根据用户特征定制分析内容

### 知识体系
- 📚 **典籍依据**：《柳庄相法》《神相全编》《麻衣相法》《太清神鉴》
- 🧠 **推理公式**：命运 = f(骨相×0.3 + 形态×0.3 + 气色×0.2 + 德行×0.2)
- 🔄 **三大原理**：形生气、气转命、德化相

## 页面流程

1. **欢迎页** (`welcome.html`) - 启动页，展示应用介绍和特性
2. **拍摄页** (`index.html`) - 摄像头拍照或上传照片
3. **加载页** (`loading.html`) - 播放预加载视频，等待 API 处理
4. **结果页** (`result-simple.html`) - 展示完整面相分析报告
5. **设置页** (`settings.html`) - 配置 OpenAI API Key

## 快速开始

### 前置要求

- Node.js (v14+)
- Python 3 (用于启动前端服务器)
- OpenAI API Key（支持 GPT-4o 或 GPT-4 Vision）

### 启动步骤

1. 运行启动脚本：
```bash
chmod +x start.sh
./start.sh
```

2. 浏览器会自动打开 `http://localhost:8000/welcome.html`

3. 首次使用需要在设置页配置 OpenAI API Key

### 手动启动

**后端：**
```bash
cd backend
npm install
npm start
# 后端服务运行在 http://localhost:3000
```

**前端：**
```bash
python3 -m http.server 8000
# 前端服务运行在 http://localhost:8000
```

## 项目结构

```
facecode/
├── welcome.html          # 欢迎启动页
├── index.html           # 拍摄页
├── loading.html         # 加载页
├── result.html          # 结果页
├── settings.html        # 设置页
├── css/
│   ├── style.css        # 主样式
│   ├── welcome.css      # 欢迎页样式
│   ├── settings.css     # 设置页样式
│   └── result-layout.css # 结果页布局
├── js/
│   ├── welcome.js       # 欢迎页逻辑
│   ├── main.js          # 拍摄页逻辑
│   ├── loading.js       # 加载页逻辑
│   ├── result.js        # 结果页逻辑
│   ├── settings.js      # 设置页逻辑
│   ├── api.js           # API 调用
│   ├── camera.js        # 摄像头控制
│   ├── storage.js       # 本地存储
│   └── config.js        # 配置文件
├── backend/
│   ├── server.js        # Express 服务器
│   ├── routes/          # 路由
│   └── controllers/     # 控制器
└── 底图动效1.mp4        # 背景视频

```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **后端**: Node.js, Express
- **AI**: OpenAI GPT-5 (Vision)
- **存储**: localStorage, sessionStorage

## 配置说明

### 1. 开发模式 vs 生产模式

**开发模式（Mock 模式）**：
在 `js/config.js` 中设置：
```javascript
const CONFIG = {
  MOCK_MODE: true,  // 使用模拟数据，无需 API Key
  USE_SIMPLE_RESULT: true,  // 使用简化版结果页
  // ...
};
```

**生产模式（真实 API）**：
```javascript
const CONFIG = {
  MOCK_MODE: false,  // 使用真实 OpenAI API
  API_BASE_URL: 'http://localhost:3000/api',
  USE_SIMPLE_RESULT: true,
  // ...
};
```

### 2. API Key 配置

**方式一：通过设置页面**
1. 访问 `http://localhost:8000/settings.html`
2. 输入你的 OpenAI API Key
3. 点击保存

**方式二：浏览器控制台**
```javascript
localStorage.setItem('openai_api_key', 'sk-your-api-key-here');
```

**获取 API Key**：
- 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
- 创建新的 API Key
- 确保账户有足够的额度

### 3. 系统提示词配置

系统提示词位于 `prompt/system_prompt.txt`，包含：
- 完整的面相学知识库（105条特征）
- 三庭五官详解
- 十二宫系统
- 气色诊断
- 流年运势
- 个性化分析逻辑

**修改提示词**：
1. 编辑 `prompt/system_prompt.txt`
2. 重启后端服务
3. 系统会自动加载新的提示词

**查看加载状态**：
后端启动时会显示：
```
✅ 系统提示词加载成功
FaceCode backend server is running on port 3000
```

### 资源路径配置

编辑 `js/config.js` 修改资源路径：

```javascript
const CONFIG = {
  API_BASE_URL: 'http://localhost:3000/api',
  BACKGROUND_VIDEO: '底图动效1.mp4',
  LOADING_VIDEO: 'loading.mp4',
  RESULT_UI_IMAGE: 'result-ui.png',
  MOCK_MODE: false
};
```

## 开发模式

设置 `MOCK_MODE: true` 可以在没有 API Key 的情况下使用 Mock 数据进行开发测试。

## 注意事项

1. 首次使用需要配置 OpenAI API Key
2. 摄像头功能需要 HTTPS 或 localhost 环境
3. 视频文件需要放在项目根目录
4. 建议使用现代浏览器（Chrome, Safari, Firefox）

## License

MIT License

---

© 2025 FaceCode. All rights reserved.
