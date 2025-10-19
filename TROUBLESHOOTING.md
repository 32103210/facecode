# FaceCode 故障排查指南

## 问题：点击"确认并开始分析"后没有返回结果

### 可能的原因和解决方案

#### 1. 检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 标签页中的错误信息。

现在代码中已添加详细的调试日志：
- 点击确认按钮时会输出日志
- API 调用过程会输出日志
- 页面跳转会输出日志

#### 2. 使用测试页面
访问 `http://localhost:8000/test.html` 进行诊断：
- 检查配置是否正确
- 测试 Storage 功能
- 测试 API 调用（Mock 模式）

#### 3. 常见问题检查清单

##### 3.1 配置问题
```javascript
// 检查 js/config.js
MOCK_MODE: true  // 开发时应该设为 true
LOADING_VIDEO: 'assets/videos/loading.mp4'  // 确保视频文件存在
```

##### 3.2 视频文件缺失
如果 `CONFIG.LOADING_VIDEO` 指向的文件不存在，可能导致加载页无法正常工作。

**解决方案**：
- 方案 A：准备一个 loading.mp4 文件放到 `assets/videos/` 目录
- 方案 B：临时使用底图视频：
  ```javascript
  LOADING_VIDEO: '底图动效1.mp4'  // 使用已有的视频
  ```

##### 3.3 SessionStorage 问题
某些浏览器的隐私模式可能限制 sessionStorage。

**测试方法**：
```javascript
// 在浏览器控制台执行
sessionStorage.setItem('test', 'value');
console.log(sessionStorage.getItem('test'));
```

##### 3.4 页面跳转被阻止
检查是否有浏览器扩展阻止了页面跳转。

#### 4. 手动测试流程

##### 步骤 1：测试拍照功能
1. 打开 `index.html`
2. 允许摄像头权限
3. 点击拍照按钮
4. 查看是否显示预览图片

##### 步骤 2：测试数据保存
在浏览器控制台执行：
```javascript
// 模拟保存数据
Storage.saveSessionData({
    image: 'data:image/jpeg;base64,test',
    openaiKey: 'mock'
});

// 检查是否保存成功
console.log(Storage.getSessionData());
```

##### 步骤 3：直接访问加载页
在浏览器控制台先保存测试数据，然后访问 `loading.html`：
```javascript
Storage.saveSessionData({
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    openaiKey: 'mock'
});
window.location.href = 'loading.html';
```

#### 5. Mock 模式测试

确保 `CONFIG.MOCK_MODE = true`，这样可以在没有真实 API Key 的情况下测试：

```javascript
// js/api.js 中的 Mock 数据会在 2 秒后返回
if (CONFIG.MOCK_MODE) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        analysis: { ... }
      });
    }, 2000);
  });
}
```

#### 6. 检查文件是否都已创建

必需的文件列表：
- ✅ `index.html`
- ✅ `loading.html`
- ✅ `result.html`
- ✅ `settings.html`
- ✅ `welcome.html`
- ✅ `js/config.js`
- ✅ `js/main.js`
- ✅ `js/loading.js`
- ✅ `js/result.js`
- ✅ `js/api.js`
- ✅ `js/storage.js`
- ✅ `js/camera.js`
- ✅ `css/loading.css`
- ⚠️  `assets/videos/loading.mp4` (可能缺失)

#### 7. 临时解决方案

如果 loading 视频文件缺失，修改 `js/config.js`：

```javascript
LOADING_VIDEO: '底图动效1.mp4',  // 使用已有的视频文件
```

或者创建一个简单的占位视频目录：
```bash
mkdir -p assets/videos
# 然后复制一个视频文件作为 loading.mp4
```

## 调试命令

### 查看当前 Session 数据
```javascript
console.log(sessionStorage.getItem('current_result'));
```

### 查看 API Keys
```javascript
console.log(Storage.getApiKeys());
```

### 查看配置
```javascript
console.log(CONFIG);
```

### 清空所有数据重新开始
```javascript
Storage.clearSessionData();
Storage.clearApiKeys();
Storage.clearHistory();
location.reload();
```

## 联系支持

如果以上方法都无法解决问题，请提供：
1. 浏览器控制台的完整错误信息
2. 浏览器类型和版本
3. 操作系统
4. 具体的操作步骤

