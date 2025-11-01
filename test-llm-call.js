/**
 * LLM调用测试脚本
 * 用于测试和分析OpenAI API调用结果
 */

const axiosModule = require('./backend/node_modules/axios');
const axios = axiosModule.default || axiosModule;
const fs = require('fs');
const path = require('path');

// 配置
const BACKEND_URL = 'http://localhost:3000';
const TEST_IMAGE_PATH = path.join(__dirname, 'image/QUICKSTART/1760863411637.png'); // 使用项目中的测试图片

// 从环境变量或命令行参数获取API Key
const API_KEY = process.env.OPENAI_API_KEY || process.argv[2];

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

// 读取图片并转换为base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    throw new Error(`无法读取图片: ${error.message}`);
  }
}

// 测试后端健康状态
async function testHealth() {
  logSection('1. 测试后端服务健康状态');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    log('✅ 后端服务正常运行', 'green');
    log(`   状态: ${response.data.status}`, 'cyan');
    return true;
  } catch (error) {
    log('❌ 后端服务未运行', 'red');
    log(`   错误: ${error.message}`, 'red');
    log('\n请先启动后端服务: cd backend && npm start', 'yellow');
    return false;
  }
}

// 测试LLM API调用
async function testLLMCall(useRealAPI = false) {
  if (useRealAPI) {
    logSection('2. 测试真实LLM API调用');
  } else {
    logSection('2. 测试Mock模式');
    log('ℹ️  当前为Mock模式，不会调用真实API', 'yellow');
    return null;
  }

  if (!API_KEY) {
    log('❌ 未提供OpenAI API Key', 'red');
    log('\n使用方法:', 'yellow');
    log('  方法1: OPENAI_API_KEY=sk-xxx node test-llm-call.js', 'cyan');
    log('  方法2: node test-llm-call.js sk-xxx', 'cyan');
    return null;
  }

  log(`📸 读取测试图片: ${TEST_IMAGE_PATH}`, 'cyan');
  
  let imageBase64;
  try {
    imageBase64 = imageToBase64(TEST_IMAGE_PATH);
    log(`✅ 图片读取成功 (大小: ${Math.round(imageBase64.length / 1024)}KB)`, 'green');
  } catch (error) {
    log(`❌ ${error.message}`, 'red');
    return null;
  }

  log('\n🚀 开始调用OpenAI API...', 'cyan');
  log('   (这可能需要10-30秒，请耐心等待)', 'yellow');

  const startTime = Date.now();

  try {
    const response = await axios.post(`${BACKEND_URL}/api/face/analyze`, {
      image: imageBase64,
      openai_api_key: API_KEY
    }, {
      timeout: 60000 // 60秒超时
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log(`\n✅ API调用成功！ (耗时: ${duration}秒)`, 'green');
    
    return response.data;
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    log(`\n❌ API调用失败 (耗时: ${duration}秒)`, 'red');
    
    if (error.response) {
      log(`   HTTP状态码: ${error.response.status}`, 'red');
      log(`   错误信息: ${error.response.data.error || '未知错误'}`, 'red');
      
      if (error.response.status === 401) {
        log('\n💡 提示: API Key可能无效或已过期', 'yellow');
      } else if (error.response.status === 429) {
        log('\n💡 提示: API调用频率超限，请稍后再试', 'yellow');
      }
    } else {
      log(`   错误: ${error.message}`, 'red');
    }
    
    return null;
  }
}

// 分析返回结果
function analyzeResult(result) {
  logSection('3. 分析返回结果');

  if (!result) {
    log('❌ 无返回结果可分析', 'red');
    return false;
  }

  log('📋 返回数据结构:', 'cyan');
  console.log(JSON.stringify(result, null, 2));

  logSection('4. 验证数据结构');

  // 检查基本结构
  if (!result.ok) {
    log('❌ 返回状态不正确 (ok != true)', 'red');
    return false;
  }
  log('✅ 返回状态正确 (ok = true)', 'green');

  if (!result.analysis) {
    log('❌ 缺少analysis字段', 'red');
    return false;
  }
  log('✅ analysis字段存在', 'green');

  // 检查必需字段
  const requiredFields = ['命运总览', '五官解读', '气运分析', '修炼建议', '传播金句'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!result.analysis[field]) {
      missingFields.push(field);
      log(`❌ 缺少字段: ${field}`, 'red');
    } else {
      log(`✅ 字段存在: ${field}`, 'green');
    }
  });

  // 检查五官解读
  if (result.analysis['五官解读']) {
    const facialParts = ['额', '眉', '眼', '鼻', '唇'];
    const missingParts = [];

    facialParts.forEach(part => {
      if (!result.analysis['五官解读'][part] || !result.analysis['五官解读'][part]['描述']) {
        missingParts.push(part);
        log(`❌ 五官解读缺少: ${part}`, 'red');
      } else {
        log(`✅ 五官解读包含: ${part}`, 'green');
      }
    });

    if (missingParts.length > 0) {
      log(`\n⚠️  五官解读不完整，缺少: ${missingParts.join(', ')}`, 'yellow');
    }
  }

  logSection('5. 内容预览');

  const analysis = result.analysis;

  if (analysis['命运总览']?.['内容']) {
    log('【命运总览】', 'bright');
    log(`  ${analysis['命运总览']['内容']}`, 'cyan');
  }

  if (analysis['五官解读']) {
    log('\n【五官解读】', 'bright');
    ['额', '眉', '眼', '鼻', '唇'].forEach(part => {
      if (analysis['五官解读'][part]) {
        const desc = analysis['五官解读'][part]['描述'];
        const ref = analysis['五官解读'][part]['典籍'];
        log(`  ${part}: ${desc}`, 'cyan');
        if (ref) {
          log(`      (${ref})`, 'yellow');
        }
      }
    });
  }

  if (analysis['气运分析']?.['内容']) {
    log('\n【气运分析】', 'bright');
    log(`  ${analysis['气运分析']['内容']}`, 'cyan');
  }

  if (analysis['修炼建议']?.['内容']) {
    log('\n【修炼建议】', 'bright');
    log(`  ${analysis['修炼建议']['内容']}`, 'cyan');
  }

  if (analysis['传播金句']?.['内容']) {
    log('\n【传播金句】', 'bright');
    log(`  ${analysis['传播金句']['内容']}`, 'cyan');
  }

  logSection('6. 总结');

  if (missingFields.length === 0) {
    log('✅ 数据结构完整，所有必需字段都存在', 'green');
    log('✅ LLM调用成功！', 'green');
    return true;
  } else {
    log(`⚠️  数据结构不完整，缺少字段: ${missingFields.join(', ')}`, 'yellow');
    log('⚠️  LLM调用部分成功，但返回数据不完整', 'yellow');
    return false;
  }
}

// 主函数
async function main() {
  console.clear();
  log('╔════════════════════════════════════════════════════════════╗', 'bright');
  log('║          FaceCode - LLM调用测试与分析工具                 ║', 'bright');
  log('╚════════════════════════════════════════════════════════════╝', 'bright');

  // 1. 测试后端健康状态
  const healthOk = await testHealth();
  if (!healthOk) {
    process.exit(1);
  }

  // 2. 测试LLM调用
  const useRealAPI = !!API_KEY;
  const result = await testLLMCall(useRealAPI);

  if (!useRealAPI) {
    log('\n💡 提示: 要测试真实API，请提供OpenAI API Key:', 'yellow');
    log('   OPENAI_API_KEY=sk-xxx node test-llm-call.js', 'cyan');
    process.exit(0);
  }

  // 3. 分析结果
  const success = analyzeResult(result);

  // 4. 保存结果到文件
  if (result) {
    const outputPath = './llm-test-result.json';
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    log(`\n💾 完整结果已保存到: ${outputPath}`, 'cyan');
  }

  process.exit(success ? 0 : 1);
}

// 运行
main().catch(error => {
  log(`\n❌ 程序执行出错: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

