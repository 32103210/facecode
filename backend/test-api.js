/**
 * 后端API测试脚本
 * 用法: node test-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 测试用的base64图片（1x1像素的透明PNG）
const TEST_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function testHealthCheck() {
  console.log('\n=== 测试健康检查 ===');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 健康检查通过:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 健康检查失败:', error.message);
    return false;
  }
}

async function testAnalysisAPI() {
  console.log('\n=== 测试面相分析API ===');
  
  // 测试1: 缺少参数
  console.log('\n1. 测试缺少参数...');
  try {
    await axios.post(`${BASE_URL}/api/face/analyze`, {});
    console.log('❌ 应该返回400错误');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ 正确返回400错误:', error.response.data.error);
    } else {
      console.log('❌ 错误类型不正确:', error.message);
    }
  }
  
  // 测试2: 无效的API Key
  console.log('\n2. 测试无效的API Key...');
  try {
    await axios.post(`${BASE_URL}/api/face/analyze`, {
      image: TEST_IMAGE,
      openai_api_key: 'invalid_key'
    });
    console.log('❌ 应该返回错误');
  } catch (error) {
    if (error.response) {
      console.log('✅ 正确返回错误:', error.response.data.error);
    } else {
      console.log('❌ 网络错误:', error.message);
    }
  }
  
  // 测试3: 有效的请求（需要真实的API Key）
  console.log('\n3. 测试有效请求...');
  console.log('⚠️ 需要真实的OpenAI API Key才能完成此测试');
  console.log('提示: 在前端页面中输入API Key进行测试');
}

async function runTests() {
  console.log('开始测试后端API...');
  console.log('确保后端服务已启动: npm start');
  
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ 后端服务未启动，请先运行: cd backend && npm start');
    return;
  }
  
  await testAnalysisAPI();
  
  console.log('\n=== 测试完成 ===');
  console.log('\n下一步:');
  console.log('1. 在浏览器中打开前端页面');
  console.log('2. 输入有效的OpenAI API Key');
  console.log('3. 上传人脸照片进行测试');
}

runTests().catch(error => {
  console.error('测试过程出错:', error);
});






