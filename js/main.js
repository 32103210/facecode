// 主页面逻辑

document.addEventListener('DOMContentLoaded', () => {
  // 设置背景视频
  const videoSource = document.getElementById('video-source');
  const backgroundVideo = document.getElementById('background-video');
  videoSource.src = CONFIG.BACKGROUND_VIDEO;
  backgroundVideo.load();

  // 加载保存的 API Keys
  const savedKeys = Storage.getApiKeys();
  document.getElementById('jimeng-key').value = savedKeys.jimengKey;
  document.getElementById('openai-key').value = savedKeys.openaiKey;

  // 元素引用
  const cameraBtn = document.getElementById('camera-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const cameraContainer = document.getElementById('camera-container');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('capture-btn');
  const closeCameraBtn = document.getElementById('close-camera-btn');
  const previewContainer = document.getElementById('preview-container');
  const previewImage = document.getElementById('preview-image');
  const confirmBtn = document.getElementById('confirm-btn');
  const retakeBtn = document.getElementById('retake-btn');
  const saveKeysCheckbox = document.getElementById('save-keys');

  let currentImageData = null;

  // 摄像头按钮
  cameraBtn.addEventListener('click', async () => {
    const success = await Camera.init(cameraVideo, cameraCanvas);
    if (success) {
      cameraContainer.style.display = 'block';
      previewContainer.style.display = 'none';
    }
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

  // 关闭摄像头
  closeCameraBtn.addEventListener('click', () => {
    Camera.stop();
    cameraContainer.style.display = 'none';
  });

  // 显示预览
  function showPreview(imageData) {
    previewImage.src = imageData;
    previewContainer.style.display = 'block';
  }

  // 确认按钮
  confirmBtn.addEventListener('click', () => {
    const jimengKey = document.getElementById('jimeng-key').value.trim();
    const openaiKey = document.getElementById('openai-key').value.trim();

    if (!jimengKey || !openaiKey) {
      alert('请输入 API Keys');
      return;
    }

    if (!currentImageData) {
      alert('请先拍照或上传照片');
      return;
    }

    // 保存 API Keys
    if (saveKeysCheckbox.checked) {
      Storage.saveApiKeys(jimengKey, openaiKey);
    }

    // 保存图片和 API Keys 到 session
    Storage.saveSessionData({
      image: currentImageData,
      jimengKey: jimengKey,
      openaiKey: openaiKey
    });

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

