// 加载页面逻辑

document.addEventListener('DOMContentLoaded', async () => {
  // 设置预加载视频
  const videoSource = document.getElementById('video-source');
  const loadingVideo = document.getElementById('loading-video');
  videoSource.src = CONFIG.LOADING_VIDEO;
  loadingVideo.load();

  // 获取 session 数据
  const sessionData = Storage.getSessionData();
  if (!sessionData) {
    alert('数据丢失，请重新开始');
    window.location.href = 'index.html';
    return;
  }

  const { image, jimengKey, openaiKey } = sessionData;
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

  // 并行调用两个 API
  try {
    statusElement.textContent = '正在生成变老状态图和面相解析...';

    const [agingResult, analysisResult] = await Promise.all([
      API.callAgingAPI(image, jimengKey),
      API.callAnalysisAPI(image, openaiKey)
    ]);

    if (!agingResult.ok || !analysisResult.ok) {
      throw new Error('API 调用失败');
    }

    apiResults = {
      originalImage: image,
      agedImages: agingResult.aged_images,
      analysis: analysisResult.analysis
    };

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
    console.error('API 调用错误:', error);
    statusElement.textContent = '分析失败，请重试';
    
    setTimeout(() => {
      if (confirm('分析失败，是否返回重试？')) {
        window.location.href = 'index.html';
      }
    }, 2000);
  }

  function navigateToResult() {
    // 保存结果到 session
    Storage.saveSessionData(apiResults);
    // 跳转到结果页
    window.location.href = 'result.html';
  }
});

