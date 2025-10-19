const axios = require('axios');

/**
 * 调用 OpenAI GPT-5 生成面相解析
 */
exports.analyzeFace = async (req, res) => {
  try {
    const { image, openai_api_key } = req.body;

    if (!image || !openai_api_key) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required parameters: image or openai_api_key'
      });
    }

    // TODO: 实际调用 OpenAI GPT-5 Vision API
    // 示例代码：
    /*
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4-vision-preview', // 或 gpt-5 当可用时
      messages: [
        {
          role: 'system',
          content: '你是一位温柔且神秘的AI面相师，专注于从人脸面相特征生成玄学风格的命运解读。'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `请根据这张人脸图片，从面相学角度进行详细解析。请分别从以下三个方面进行解读，每个方面 100-150 字：

1. **姻缘**：分析此人的感情运势、婚姻状况、桃花运等。
2. **事业**：分析此人的事业发展、职场运势、领导力等。
3. **财运**：分析此人的财富运势、理财能力、偏财正财等。

要求：
1) 每个方面独立成段，100-150 字。
2) 语气神秘但温柔，用词带有玄学氛围。
3) 不得宣称绝对结果，仅做温柔提示和建议。
4) 禁止提及具体医疗建议、违法预测或绝对时间（如"你将在XX年"）。
5) 以 JSON 格式返回：{"marriage": "...", "career": "...", "wealth": "..."}

请直接返回 JSON 格式的解析结果。`
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${openai_api_key}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    const analysis = JSON.parse(content);
    */

    // 暂时返回模拟数据
    console.log('Analysis API called with image size:', image.length);
    
    const mockAnalysis = {
      ok: true,
      analysis: {
        marriage: '从面相来看，您的眉眼温和，唇角微扬，这是桃花运旺盛的象征。感情路上虽有波折，但终能遇到心仪之人。建议在选择伴侣时多听从内心，不要过于追求完美。婚后需注意沟通，以柔克刚，方能白头偕老。',
        career: '您的额头饱满，鼻梁挺直，这是事业有成的面相。在职场上有较强的领导力和决策能力，适合从事管理或创业。但需注意不要过于刚强，学会倾听他人意见。中年后事业将迎来高峰，财富也会随之而来。',
        wealth: '从鼻相来看，您的财运较为稳定，正财运佳。适合通过稳健投资积累财富，不宜冒险投机。中年后财运会有明显提升，但需注意理财规划。建议多行善事，财富自然会源源不断。'
      }
    };

    res.json(mockAnalysis);

  } catch (error) {
    console.error('Analysis API error:', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Failed to analyze face'
    });
  }
};

/**
 * 内容审查函数
 */
function sanitizeText(text) {
  // 简单的关键词过滤
  const forbiddenWords = ['死', '病', '灾', '祸'];
  let sanitized = text;
  
  forbiddenWords.forEach(word => {
    sanitized = sanitized.replace(new RegExp(word, 'g'), '***');
  });
  
  return sanitized;
}

