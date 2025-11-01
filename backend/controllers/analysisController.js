const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 读取简化版系统提示词
let SYSTEM_PROMPT = '';
try {
  const promptPath = path.join(__dirname, '../../prompt/simple_system_prompt.txt');
  SYSTEM_PROMPT = fs.readFileSync(promptPath, 'utf-8');
  console.log('✅ 简化版系统提示词加载成功');
} catch (error) {
  console.warn('⚠️ 无法加载系统提示词，使用默认提示词');
  SYSTEM_PROMPT = `你是一位精通道家面相学的AI命理分析师。请根据面部图像生成JSON格式的面相分析，包含以下字段：
  {
    "命运总览": {"内容": "40-60字"},
    "五官解读": {"额": {"描述": "25-40字"}, "眉": {"描述": "25-40字"}, "眼": {"描述": "25-40字"}, "鼻": {"描述": "25-40字"}, "唇": {"描述": "25-40字"}},
    "气运分析": {"内容": "50-80字"},
    "修炼建议": {"内容": "50-80字"},
    "传播金句": {"内容": "12-20字"}
  }
  只输出JSON，不要markdown标记。`;
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
              text: `请根据这张人脸图片进行面相分析。

要求：
1. 必须严格按照以下JSON格式输出
2. 不要使用markdown代码块（不要\`\`\`json\`\`\`包裹）
3. 只输出纯JSON对象，不要任何解释文字
4. 确保所有必需字段都存在

必需的JSON结构：
{
  "命运总览": {"内容": "40-60字的命运概述"},
  "五官解读": {
    "额": {"描述": "25-40字", "典籍": "可选"},
    "眉": {"描述": "25-40字", "典籍": "可选"},
    "眼": {"描述": "25-40字", "典籍": "可选"},
    "鼻": {"描述": "25-40字", "典籍": "可选"},
    "唇": {"描述": "25-40字", "典籍": "可选"}
  },
  "气运分析": {"内容": "50-80字的运势分析"},
  "修炼建议": {"内容": "50-80字的调理建议"},
  "传播金句": {"内容": "12-20字的有趣金句"}
}

现在开始分析，只输出JSON：`
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
    console.log('✅ OpenAI 返回内容（前500字符）:', content.substring(0, 500));
    console.log('📏 返回内容总长度:', content.length);
    
    // 解析 JSON - 增强版
    let analysis;
    try {
      analysis = parseAIResponse(content);
      console.log('✅ JSON 解析成功');
      
      // 验证必需字段
      validateAnalysisStructure(analysis);
      console.log('✅ 数据结构验证通过');
      
    } catch (parseError) {
      console.error('❌ JSON 解析或验证失败:', parseError.message);
      console.error('原始返回内容:', content);
      throw new Error(`AI 返回的内容格式不正确: ${parseError.message}`);
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
    
    // 其他错误返回通用错误信息
    return res.status(500).json({
      ok: false,
      error: error.message || 'Failed to analyze face'
    });
  }
};

/**
 * 解析AI返回的内容，提取JSON
 */
function parseAIResponse(content) {
  let jsonStr = content.trim();
  
  // 步骤1: 移除markdown代码块标记
  // 匹配 ```json ... ``` 或 ``` ... ```
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
    console.log('📝 检测到markdown代码块，已提取');
  }
  
  // 步骤2: 如果还有其他文本，尝试提取第一个完整的JSON对象
  if (!jsonStr.startsWith('{')) {
    const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      jsonStr = jsonObjectMatch[0];
      console.log('📝 从文本中提取JSON对象');
    }
  }
  
  // 步骤3: 清理可能的前后空白和干扰字符
  jsonStr = jsonStr.trim();
  
  // 步骤4: 尝试解析JSON
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error) {
    // 尝试修复常见的JSON错误
    console.log('⚠️ 首次解析失败，尝试修复...');
    
    // 移除可能的BOM标记
    jsonStr = jsonStr.replace(/^\uFEFF/, '');
    
    // 尝试再次解析
    try {
      const parsed = JSON.parse(jsonStr);
      console.log('✅ 修复后解析成功');
      return parsed;
    } catch (secondError) {
      throw new Error(`JSON解析失败: ${secondError.message}`);
    }
  }
}

/**
 * 验证分析结果的数据结构
 */
function validateAnalysisStructure(analysis) {
  const requiredFields = ['命运总览', '五官解读', '气运分析', '修炼建议', '传播金句'];
  const missingFields = [];
  
  // 检查一级字段
  for (const field of requiredFields) {
    if (!analysis[field]) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`缺少必需字段: ${missingFields.join(', ')}`);
  }
  
  // 检查命运总览
  if (!analysis.命运总览.内容 || typeof analysis.命运总览.内容 !== 'string') {
    throw new Error('命运总览.内容 字段无效');
  }
  
  // 检查五官解读
  const facialParts = ['额', '眉', '眼', '鼻', '唇'];
  const missingParts = [];
  
  for (const part of facialParts) {
    if (!analysis.五官解读[part] || !analysis.五官解读[part].描述) {
      missingParts.push(part);
    }
  }
  
  if (missingParts.length > 0) {
    throw new Error(`五官解读缺少部位: ${missingParts.join(', ')}`);
  }
  
  // 检查气运分析
  if (!analysis.气运分析.内容 || typeof analysis.气运分析.内容 !== 'string') {
    throw new Error('气运分析.内容 字段无效');
  }
  
  // 检查修炼建议
  if (!analysis.修炼建议.内容 || typeof analysis.修炼建议.内容 !== 'string') {
    throw new Error('修炼建议.内容 字段无效');
  }
  
  // 检查传播金句
  if (!analysis.传播金句.内容 || typeof analysis.传播金句.内容 !== 'string') {
    throw new Error('传播金句.内容 字段无效');
  }
  
  console.log('✅ 所有必需字段验证通过');
}

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

