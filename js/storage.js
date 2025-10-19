// localStorage 管理模块

const Storage = {
  // API Key 相关
  saveApiKeys(jimengKey, openaiKey) {
    localStorage.setItem('jimeng_api_key', jimengKey);
    localStorage.setItem('openai_api_key', openaiKey);
  },

  getApiKeys() {
    return {
      jimengKey: localStorage.getItem('jimeng_api_key') || '',
      openaiKey: localStorage.getItem('openai_api_key') || ''
    };
  },

  clearApiKeys() {
    localStorage.removeItem('jimeng_api_key');
    localStorage.removeItem('openai_api_key');
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

