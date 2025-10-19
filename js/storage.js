// localStorage 管理模块

const Storage = {
  // API Key 相关
  saveApiKeys(_, openaiKey) {
    // 不再保存极梦 API Key
    localStorage.setItem('openai_api_key', openaiKey);
  },

  getApiKeys() {
    return {
      openaiKey: localStorage.getItem('openai_api_key') || sessionStorage.getItem('temp_openai_key') || ''
    };
  },

  clearApiKeys() {
    localStorage.removeItem('openai_api_key');
    sessionStorage.removeItem('temp_openai_key');
  },

  // 历史记录相关
  saveHistory(data) {
    const history = this.getHistory();
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      originalImage: data.originalImage,
      agedImages: data.agedImages,
      analysis: data.analysis
    };
    history.unshift(record);
    
    // 最多保存 10 条记录
    if (history.length > 10) {
      history.pop();
    }
    
    localStorage.setItem('face_history', JSON.stringify(history));
  },

  getHistory() {
    const history = localStorage.getItem('face_history');
    return history ? JSON.parse(history) : [];
  },

  clearHistory() {
    localStorage.removeItem('face_history');
  },

  // Session 数据（用于页面间传递）
  saveSessionData(data) {
    sessionStorage.setItem('current_result', JSON.stringify(data));
  },

  getSessionData() {
    const data = sessionStorage.getItem('current_result');
    return data ? JSON.parse(data) : null;
  },

  clearSessionData() {
    sessionStorage.removeItem('current_result');
  }
};

