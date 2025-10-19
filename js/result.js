// 结果页面逻辑

let carousel = null;

document.addEventListener('DOMContentLoaded', () => {
  // 获取结果数据
  const resultData = Storage.getSessionData();
  if (!resultData) {
    alert('没有找到结果数据，请重新开始');
    window.location.href = 'index.html';
    return;
  }

  // 设置 UI 框架图片
  const uiImage = document.getElementById('result-ui-image');
  uiImage.src = CONFIG.RESULT_UI_IMAGE;

  // 等待 UI 图片加载完成后设置布局
  uiImage.onload = () => {
    setupLayout();
    displayResults(resultData);
  };

  // 如果图片已经缓存，立即设置
  if (uiImage.complete) {
    setupLayout();
    displayResults(resultData);
  }

  // 按钮事件
  document.getElementById('share-btn').addEventListener('click', () => shareResult(resultData));
  document.getElementById('save-btn').addEventListener('click', () => saveToHistory(resultData));
  document.getElementById('back-btn').addEventListener('click', () => {
    Storage.clearSessionData();
    window.location.href = 'index.html';
  });
});

// 设置布局
function setupLayout() {
  const layout = CONFIG.RESULT_LAYOUT;
  
  // 设置各个内容区域的位置
  Object.keys(layout).forEach(key => {
    const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element && layout[key]) {
      const styles = layout[key];
      element.style.top = styles.top;
      element.style.left = styles.left;
      element.style.width = styles.width;
      if (styles.height) {
        element.style.height = styles.height;
      }
      if (styles.fontSize) {
        element.style.fontSize = styles.fontSize;
      }
      if (styles.color) {
        element.style.color = styles.color;
      }
    }
  });
}

// 显示结果
function displayResults(data) {
  // 显示原始图片
  document.getElementById('original-image').src = data.originalImage;

  // 初始化轮播图
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicators = document.getElementById('carousel-indicators');
  
  carousel = new Carousel(track, prevBtn, nextBtn, indicators);
  carousel.loadImages(data.agedImages);

  // 显示面相解析
  document.getElementById('marriage-content').textContent = data.analysis.marriage;
  document.getElementById('career-content').textContent = data.analysis.career;
  document.getElementById('wealth-content').textContent = data.analysis.wealth;
}

// 分享结果
function shareResult(data) {
  const canvas = document.getElementById('share-canvas');
  const ctx = canvas.getContext('2d');

  // 设置画布大小
  canvas.width = 1080;
  canvas.height = 1920;

  // 绘制背景
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制标题
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('FaceCode｜面码 - 面相解析', canvas.width / 2, 80);

  // 加载并绘制图片
  const originalImg = new Image();
  originalImg.crossOrigin = 'anonymous';
  originalImg.onload = () => {
    // 绘制原始图片
    const imgWidth = 400;
    const imgHeight = (originalImg.height / originalImg.width) * imgWidth;
    ctx.drawImage(originalImg, 100, 150, imgWidth, imgHeight);

    // 绘制变老图片
    const agedImg = new Image();
    agedImg.crossOrigin = 'anonymous';
    const currentAgedImage = carousel.getCurrentImage();
    agedImg.onload = () => {
      ctx.drawImage(agedImg, 580, 150, imgWidth, imgHeight);

      // 绘制文字
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#333';

      let y = 150 + imgHeight + 80;

      // 姻缘
      ctx.font = 'bold 28px Arial';
      ctx.fillText('姻缘', 100, y);
      y += 40;
      ctx.font = '20px Arial';
      wrapText(ctx, data.analysis.marriage, 100, y, 880, 30);
      y += 150;

      // 事业
      ctx.font = 'bold 28px Arial';
      ctx.fillText('事业', 100, y);
      y += 40;
      ctx.font = '20px Arial';
      wrapText(ctx, data.analysis.career, 100, y, 880, 30);
      y += 150;

      // 财运
      ctx.font = 'bold 28px Arial';
      ctx.fillText('财运', 100, y);
      y += 40;
      ctx.font = '20px Arial';
      wrapText(ctx, data.analysis.wealth, 100, y, 880, 30);

      // 下载图片
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facecode_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        alert('分享图片已保存！');
      });
    };
    agedImg.src = currentAgedImage || data.agedImages[0].url;
  };
  originalImg.src = data.originalImage;
}

// 文字换行
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';
  let lines = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i];
      y += lineHeight;
      lines++;
      if (lines >= 4) break; // 最多4行
    } else {
      line = testLine;
    }
  }
  if (lines < 4) {
    ctx.fillText(line, x, y);
  }
}

// 保存到历史
function saveToHistory(data) {
  Storage.saveHistory(data);
  alert('已保存到历史记录！');
}

