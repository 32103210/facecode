// 过渡页面逻辑

document.addEventListener('DOMContentLoaded', () => {
  console.log('========== 过渡页面已加载 ==========');
  
  // 设置过渡视频
  const videoSource = document.getElementById('transition-video-source');
  const transitionVideo = document.getElementById('transition-video');
  
  console.log('视频路径:', CONFIG.TRANSITION_VIDEO);
  
  videoSource.src = CONFIG.TRANSITION_VIDEO;
  transitionVideo.load();
  
  // 监听视频加载事件（仅控制台日志）
  transitionVideo.addEventListener('loadeddata', () => {
    console.log('✅ 视频加载成功，时长:', transitionVideo.duration.toFixed(2) + '秒');
  });
  
  transitionVideo.addEventListener('error', (e) => {
    console.error('❌ 视频加载失败:', e);
  });
  
  transitionVideo.addEventListener('play', () => {
    console.log('▶️  视频开始播放');
  });
  
  console.log('✨ 淡入动画已启动（1.5秒）');
  
  // 1.8秒后开始淡出并立即跳转（交叉溶解）
  setTimeout(() => {
    console.log('🌅 开始淡出...');
    transitionVideo.classList.add('fade-out');
    
    // 几乎立即跳转，让两个视频完全交叉溶解
    setTimeout(() => {
      console.log('🚀 跳转到拍摄页（交叉溶解）...');
      window.location.href = 'index.html';
    }, 100);  // 100ms后跳转，确保淡出已开始
  }, 1800);
});

