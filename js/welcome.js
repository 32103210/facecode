// 欢迎页逻辑

document.addEventListener('DOMContentLoaded', () => {
  // 设置背景视频
  const videoSource = document.getElementById('welcome-video-source');
  const welcomeVideo = document.getElementById('welcome-video');
  videoSource.src = CONFIG.WELCOME_VIDEO;
  welcomeVideo.load();

  const startBtn = document.getElementById('start-btn');
  
  // 点击开始按钮，跳转到过渡页
  startBtn.addEventListener('click', () => {
    console.log('开始体验按钮被点击，跳转到过渡页');
    window.location.href = 'transition.html';
  });
  
  // 监听键盘事件，按 Enter 或 Space 也可以开始
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      startBtn.click();
    }
  });
});

