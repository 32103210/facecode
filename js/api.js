// API 调用模块

const API = {
  // 调用极梦 API 生成变老图片
  async callAgingAPI(imageBase64, jimengApiKey) {
    if (CONFIG.MOCK_MODE) {
      // Mock 数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            original_image: imageBase64,
            aged_images: [
              { age: '30岁', url: imageBase64 },
              { age: '50岁', url: imageBase64 },
              { age: '70岁', url: imageBase64 }
            ]
          });
        }, 2000);
      });
    }

    const url = `${CONFIG.API_BASE_URL}/face/aging`;
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: imageBase64,
        jimeng_api_key: jimengApiKey
      })
    });

    return response;
  },

  // 调用 OpenAI GPT-5 生成面相解析
  async callAnalysisAPI(imageBase64, openaiApiKey) {
    if (CONFIG.MOCK_MODE) {
      // Mock 数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            analysis: {
              marriage: '从面相来看，您的眉眼温和，唇角微扬，这是桃花运旺盛的象征。感情路上虽有波折，但终能遇到心仪之人。建议在选择伴侣时多听从内心，不要过于追求完美。婚后需注意沟通，以柔克刚，方能白头偕老。',
              career: '您的额头饱满，鼻梁挺直，这是事业有成的面相。在职场上有较强的领导力和决策能力，适合从事管理或创业。但需注意不要过于刚强，学会倾听他人意见。中年后事业将迎来高峰，财富也会随之而来。',
              wealth: '从鼻相来看，您的财运较为稳定，正财运佳。适合通过稳健投资积累财富，不宜冒险投机。中年后财运会有明显提升，但需注意理财规划。建议多行善事，财富自然会源源不断。'
            }
          });
        }, 2000);
      });
    }

    const url = `${CONFIG.API_BASE_URL}/face/analyze`;
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: imageBase64,
        openai_api_key: openaiApiKey
      })
    });

    return response;
  },

  // 带重试的 fetch
  async fetchWithRetry(url, options, retries = CONFIG.RETRY_TIMES) {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries) {
          throw error;
        }
        console.log(`请求失败，正在重试 (${i + 1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};

