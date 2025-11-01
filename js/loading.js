// 加载页面逻辑

document.addEventListener('DOMContentLoaded', async () => {
  console.log('加载页面已启动');
  
  // 设置预加载视频
  const videoSource = document.getElementById('video-source');
  const loadingVideo = document.getElementById('loading-video');
  videoSource.src = CONFIG.LOADING_VIDEO;
  loadingVideo.load();
  console.log('视频源设置为:', CONFIG.LOADING_VIDEO);

  // 获取 session 数据
  const sessionData = Storage.getSessionData();
  console.log('Session 数据:', sessionData ? '已获取' : '未找到');
  
  if (!sessionData) {
    alert('数据丢失，请重新开始');
    window.location.href = 'index.html';
    return;
  }

  const { image, openaiKey } = sessionData;
  console.log('图片数据长度:', image ? image.length : 0);
  console.log('API Key:', openaiKey);
  
  const statusElement = document.getElementById('loading-status');

  let apiResults = null;
  let isVideoLoopComplete = false;

  // 监听视频循环
  let videoStartTime = null;
  loadingVideo.addEventListener('timeupdate', () => {
    if (videoStartTime === null) {
      videoStartTime = loadingVideo.currentTime;
    }

    // 检测是否完成一个循环（接近视频结尾）
    if (loadingVideo.duration - loadingVideo.currentTime < 0.5) {
      if (apiResults) {
        // API 已返回且视频即将结束，准备跳转
        isVideoLoopComplete = true;
      }
    }
  });

  loadingVideo.addEventListener('ended', () => {
    if (apiResults) {
      navigateToResult();
    }
  });

  // 调用 OpenAI API 生成面相解析
  try {
    statusElement.textContent = '正在分析您的面相...';
    console.log('开始调用 API...');

    const analysisResult = await API.callAnalysisAPI(image, openaiKey);
    console.log('API 调用结果:', analysisResult);

    if (!analysisResult.ok) {
      throw new Error('API 调用失败');
    }

    apiResults = {
      originalImage: image,
      analysis: analysisResult.analysis
    };

    console.log('API 结果已保存:', apiResults);
    statusElement.textContent = '分析完成，即将展示结果...';

    // 如果视频还在播放，等待当前循环结束
    if (!isVideoLoopComplete) {
      // 等待视频循环结束
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (isVideoLoopComplete || loadingVideo.ended) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    navigateToResult();

  } catch (error) {
    console.error('❌ API 调用错误:', error);
    
    // 详细的错误信息
    let errorDetail = error.message || '未知错误';
    statusElement.textContent = `分析失败: ${errorDetail}`;
    
    // 调试模式：显示更多信息
    if (CONFIG.DEBUG_MODE) {
      console.log('🔍 [DEBUG] 错误详情:', {
        message: error.message,
        stack: error.stack,
        sessionData: sessionData
      });
      
      // 尝试从localStorage获取保存的错误信息
      try {
        const savedError = localStorage.getItem('last_api_error');
        if (savedError) {
          console.log('🔍 [DEBUG] 保存的错误信息:', JSON.parse(savedError));
        }
      } catch (e) {
        // 忽略
      }
    }
    
    setTimeout(() => {
      const errorMsg = `分析失败: ${errorDetail}\n\n是否返回重试？`;
      if (confirm(errorMsg)) {
        window.location.href = 'index.html';
      }
    }, 2000);
  }

  function navigateToResult() {
    console.log('准备跳转到结果页');
    console.log('最终结果数据:', apiResults);
    
    // 保存结果到 session
    Storage.saveSessionData(apiResults);
    console.log('结果已保存到 Session');
    
    // 跳转到结果页（使用简化版便于调试）
    // 可以改为 'result.html' 使用完整版
    const resultPage = CONFIG.USE_SIMPLE_RESULT ? 'result-simple.html' : 'result.html';
    console.log('跳转到:', resultPage);
    window.location.href = resultPage;
  }
});

