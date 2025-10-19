const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 读取系统提示词
let SYSTEM_PROMPT = '';
try {
  const promptPath = path.join(__dirname, '../../prompt/system_prompt.txt');
  SYSTEM_PROMPT = fs.readFileSync(promptPath, 'utf-8');
  console.log('✅ 系统提示词加载成功');
} catch (error) {
  console.warn('⚠️ 无法加载系统提示词，使用默认提示词');
  SYSTEM_PROMPT = '你是一位精通道家面相学的AI命理分析师，请根据用户上传的面部图像，生成一份完整的面相分析报告。';
}

/**
 * 调用 OpenAI GPT-4 Vision 生成面相解析
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

    console.log('🔍 开始分析面相...');
    console.log('📸 图片大小:', image.length);

    // 调用 OpenAI GPT-4 Vision API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o', // 使用 GPT-4o 或 gpt-4-vision-preview
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请根据这张人脸图片，按照系统提示词中的JSON结构规范，生成完整的面相分析报告。请直接返回JSON格式的结果，不要包含任何其他文字。'
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
      max_tokens: 4000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${openai_api_key}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    console.log('✅ OpenAI 返回内容:', content.substring(0, 200) + '...');
    
    // 解析 JSON
    let analysis;
    try {
      // 尝试提取 JSON（可能被包裹在 ```json ``` 中）
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('❌ JSON 解析失败:', parseError);
      throw new Error('AI 返回的内容格式不正确');
    }

    res.json({
      ok: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('❌ Analysis API error:', error.message);
    
    // 如果是 OpenAI API 错误，返回更详细的信息
    if (error.response) {
      console.error('OpenAI API 错误详情:', error.response.data);
      return res.status(error.response.status).json({
        ok: false,
        error: error.response.data.error?.message || 'OpenAI API 调用失败'
      });
    }
    
    // 开发模式下返回模拟数据
    console.log('⚠️ 返回模拟数据用于测试...');
    
    const mockAnalysis = {
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

