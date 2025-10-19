// API 调用模块

const API = {
  // 调用 OpenAI GPT-5 生成面相解析
  async callAnalysisAPI(imageBase64, openaiApiKey) {
    if (CONFIG.MOCK_MODE) {
      // Mock 数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            analysis: {
              "命运总览": {
                "内容": "你的面藏风水，气自成局；命中注定不是随波逐流的人。"
              },
              "五官解读": {
                "额": {
                  "描述": "天庭宽阔，志在高远",
                  "典籍": "出自《柳庄相法·三停论》"
                },
                "眉": {
                  "描述": "眉形柔中带锋，有主见亦有温度"
                },
                "眼": {
                  "描述": "目光藏笑，是温柔的策士"
                },
                "鼻": {
                  "描述": "鼻正气顺，财缘自稳",
                  "典籍": "见《神相全编》"
                },
                "唇": {
                  "描述": "唇色和气，言语有福"
                }
              },
              "气运分析": {
                "内容": "气聚中庭，贵人运渐起；你或许已站在转机之前，只待一句真心的话语成全未来。近期宜静观其变，顺势而为，切勿强求。"
              },
              "修炼建议": {
                "内容": "静坐三息，观心而不执；凡事不急，运自来。若有不顺，宜以光亮之物相伴，晨起面东而立，纳清气以养神。"
              },
              "传播金句": {
                "内容": "命里藏buff，天生开挂脸。"
              }
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

