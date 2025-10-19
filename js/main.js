// 主页面逻辑

document.addEventListener('DOMContentLoaded', () => {
  // 设置背景视频
  const videoSource = document.getElementById('video-source');
  const backgroundVideo = document.getElementById('background-video');
  videoSource.src = CONFIG.BACKGROUND_VIDEO;
  backgroundVideo.load();

  // 元素引用
  const settingsBtn = document.getElementById('settings-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const cameraContainer = document.getElementById('camera-container');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('capture-btn');
  const previewContainer = document.getElementById('preview-container');
  const previewImage = document.getElementById('preview-image');
  const confirmBtn = document.getElementById('confirm-btn');
  const retakeBtn = document.getElementById('retake-btn');

  let currentImageData = null;

  // 页面加载时自动启动摄像头
  const initCamera = async () => {
    const success = await Camera.init(cameraVideo, cameraCanvas);
    if (!success) {
      console.error('摄像头启动失败');
    }
  };
  initCamera();

  // 设置按钮
  settingsBtn.addEventListener('click', () => {
    window.location.href = 'settings.html';
  });

  // 上传按钮
  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  // 文件选择
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        currentImageData = await Camera.compressImage(event.target.result);
        showPreview(currentImageData);
      };
      reader.readAsDataURL(file);
    }
  });

  // 拍照按钮
  captureBtn.addEventListener('click', async () => {
    const imageData = Camera.capture();
    if (imageData) {
      currentImageData = await Camera.compressImage(imageData);
      Camera.stop();
      cameraContainer.style.display = 'none';
      showPreview(currentImageData);
    }
  });

  // 显示预览
  function showPreview(imageData) {
    previewImage.src = imageData;
    previewContainer.style.display = 'block';
  }

  // 确认按钮
  confirmBtn.addEventListener('click', () => {
    console.log('确认按钮被点击');
    
    const savedKeys = Storage.getApiKeys();
    const openaiKey = savedKeys.openaiKey;
    console.log('OpenAI Key:', openaiKey ? '已配置' : '未配置');

    if (!openaiKey && !CONFIG.MOCK_MODE) {
      alert('请先在设置中配置 OpenAI API Key');
      window.location.href = 'settings.html';
      return;
    }

    if (!currentImageData) {
      alert('请先拍照或上传照片');
      return;
    }

    console.log('图片数据长度:', currentImageData.length);

    // 保存图片和 API Key 到 session
    Storage.saveSessionData({
      image: currentImageData,
      openaiKey: openaiKey || 'mock'
    });

    console.log('数据已保存到 session，准备跳转到加载页');

    // 跳转到加载页
    window.location.href = 'loading.html';
  });

  // 重新拍摄
  retakeBtn.addEventListener('click', () => {
    currentImageData = null;
    previewContainer.style.display = 'none';
    fileInput.value = '';
  });
});

