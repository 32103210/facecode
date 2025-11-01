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
          // 尝试获取错误详情
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // 无法解析错误响应，使用默认消息
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        
        // 调试模式：保存原始响应
        if (CONFIG.DEBUG_MODE) {
          console.log('🔍 [DEBUG] API 原始响应:', result);
          try {
            localStorage.setItem('last_api_response', JSON.stringify(result, null, 2));
            console.log('🔍 [DEBUG] 响应已保存到 localStorage.last_api_response');
          } catch (e) {
            console.warn('无法保存调试信息到localStorage:', e);
          }
        }
        
        return result;
      } catch (error) {
        if (i === retries) {
          console.error('❌ API 调用失败:', error.message);
          
          // 调试模式：保存错误信息
          if (CONFIG.DEBUG_MODE) {
            try {
              localStorage.setItem('last_api_error', JSON.stringify({
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
              }, null, 2));
              console.log('🔍 [DEBUG] 错误信息已保存到 localStorage.last_api_error');
            } catch (e) {
              console.warn('无法保存错误信息到localStorage:', e);
            }
          }
          
          throw error;
        }
        console.log(`⚠️ 请求失败，正在重试 (${i + 1}/${retries})...`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};

