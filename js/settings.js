// 设置页面逻辑

document.addEventListener('DOMContentLoaded', () => {
  // 设置背景视频
  const videoSource = document.getElementById('video-source');
  const backgroundVideo = document.getElementById('background-video');
  videoSource.src = CONFIG.BACKGROUND_VIDEO;
  backgroundVideo.load();

  // 加载保存的 API Keys
  const savedKeys = Storage.getApiKeys();
  document.getElementById('openai-key').value = savedKeys.openaiKey;

  // 返回按钮
  document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // 保存设置
  document.getElementById('save-settings-btn').addEventListener('click', () => {
    const openaiKey = document.getElementById('openai-key').value.trim();
    const saveKeys = document.getElementById('save-keys').checked;

    if (!openaiKey) {
      alert('请输入 OpenAI API Key');
      return;
    }

    if (saveKeys) {
      Storage.saveApiKeys(null, openaiKey);
      alert('设置已保存！');
    } else {
      // 如果不保存，使用 sessionStorage 临时存储
      sessionStorage.setItem('temp_openai_key', openaiKey);
      alert('API Key 已临时保存（仅本次会话有效）');
    }
  });

  // 清除历史记录
  document.getElementById('clear-history-btn').addEventListener('click', () => {
    if (confirm('确定要清除所有历史记录吗？')) {
      Storage.clearHistory();
      alert('历史记录已清除！');
    }
  });

  // 清除 API Keys
  document.getElementById('clear-keys-btn').addEventListener('click', () => {
    if (confirm('确定要清除保存的 API Keys 吗？')) {
      Storage.clearApiKeys();
      document.getElementById('openai-key').value = '';
      alert('API Keys 已清除！');
    }
  });
});

