// 结果页面逻辑

let carousel = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('========== 结果页面已加载 ==========');
  
  // 获取结果数据
  const resultData = Storage.getSessionData();
  console.log('从 Session 获取的结果数据:', resultData);
  
  if (!resultData) {
    console.error('❌ 没有找到结果数据');
    alert('没有找到结果数据，请重新开始');
    window.location.href = 'index.html';
    return;
  }

  console.log('✅ 结果数据验证通过');
  console.log('📊 数据详情:');
  console.log('  - 原始图片长度:', resultData.originalImage ? resultData.originalImage.length : 0);
  console.log('  - 分析结果:', resultData.analysis);
  console.log('    · 姻缘:', resultData.analysis?.marriage);
  console.log('    · 事业:', resultData.analysis?.career);
  console.log('    · 财运:', resultData.analysis?.wealth);

  // 设置 UI 框架图片
  const uiImage = document.getElementById('result-ui-image');
  console.log('🖼️  UI 框架图片路径:', CONFIG.RESULT_UI_IMAGE);
  uiImage.src = CONFIG.RESULT_UI_IMAGE;

  // 等待 UI 图片加载完成后设置布局
  uiImage.onload = () => {
    console.log('✅ UI 框架图片加载成功');
    setupLayout();
    displayResults(resultData);
  };

  uiImage.onerror = (error) => {
    console.error('❌ UI 框架图片加载失败:', error);
    console.log('⚠️  将继续显示结果（无框架图片）');
    displayResults(resultData);
  };

  // 如果图片已经缓存，立即设置
  if (uiImage.complete) {
    console.log('✅ UI 框架图片已缓存');
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
  console.log('🎨 开始设置布局');
  const layout = CONFIG.RESULT_LAYOUT;
  console.log('布局配置:', layout);
  
  // 设置各个内容区域的位置
  Object.keys(layout).forEach(key => {
    const elementId = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    const element = document.getElementById(elementId);
    
    if (element && layout[key]) {
      const styles = layout[key];
      console.log(`  设置 ${elementId} 的样式:`, styles);
      
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
    } else {
      console.warn(`  ⚠️  未找到元素: ${elementId}`);
    }
  });
  
  console.log('✅ 布局设置完成');
}

// 显示结果
function displayResults(data) {
  console.log('📝 开始显示结果');
  
  try {
    // 显示原始图片
    const originalImage = document.getElementById('original-image');
    if (originalImage) {
      originalImage.src = data.originalImage;
      console.log('✅ 原始图片已设置');
    } else {
      console.error('❌ 未找到 original-image 元素');
    }

    // 隐藏变老图片轮播区域（不再使用）
    const carouselContainer = document.getElementById('aged-images-carousel');
    if (carouselContainer) {
      carouselContainer.style.display = 'none';
      console.log('✅ 轮播区域已隐藏');
    }

    // 显示面相解析
    const marriageContent = document.getElementById('marriage-content');
    const careerContent = document.getElementById('career-content');
    const wealthContent = document.getElementById('wealth-content');
    
    if (marriageContent && data.analysis?.marriage) {
      marriageContent.textContent = data.analysis.marriage;
      console.log('✅ 姻缘内容已设置:', data.analysis.marriage.substring(0, 50) + '...');
    } else {
      console.error('❌ 姻缘内容设置失败');
    }
    
    if (careerContent && data.analysis?.career) {
      careerContent.textContent = data.analysis.career;
      console.log('✅ 事业内容已设置:', data.analysis.career.substring(0, 50) + '...');
    } else {
      console.error('❌ 事业内容设置失败');
    }
    
    if (wealthContent && data.analysis?.wealth) {
      wealthContent.textContent = data.analysis.wealth;
      console.log('✅ 财运内容已设置:', data.analysis.wealth.substring(0, 50) + '...');
    } else {
      console.error('❌ 财运内容设置失败');
    }
    
    console.log('========== 结果显示完成 ==========');
  } catch (error) {
    console.error('❌ 显示结果时出错:', error);
    console.error('错误堆栈:', error.stack);
  }
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
    // 绘制原始图片（居中）
    const imgWidth = 600;
    const imgHeight = (originalImg.height / originalImg.width) * imgWidth;
    ctx.drawImage(originalImg, (canvas.width - imgWidth) / 2, 150, imgWidth, imgHeight);

    // 绘制文字
    let y = 150 + imgHeight + 80;
    
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#5B9A9F';
    ctx.textAlign = 'left';
    
    // 姻缘
    ctx.fillText('姻缘', 100, y);
    y += 50;
    ctx.font = '24px Arial';
    ctx.fillStyle = '#B0B0B0';
    wrapText(ctx, data.analysis.marriage, 100, y, 880, 35);
    y += 180;

    // 事业
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#5B9A9F';
    ctx.fillText('事业', 100, y);
    y += 50;
    ctx.font = '24px Arial';
    ctx.fillStyle = '#B0B0B0';
    wrapText(ctx, data.analysis.career, 100, y, 880, 35);
    y += 180;

    // 财运
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#5B9A9F';
    ctx.fillText('财运', 100, y);
    y += 50;
    ctx.font = '24px Arial';
    ctx.fillStyle = '#B0B0B0';
    wrapText(ctx, data.analysis.wealth, 100, y, 880, 35);

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
  originalImg.src = data.originalImage;
}

// 文字换行
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split('');
  let line = '';
  let lines = 0;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, y);
      line = chars[i];
      y += lineHeight;
      lines++;
      if (lines >= 4) break;
    } else {
      line = testLine;
    }
  }
  
  if (lines < 4 && line.length > 0) {
    ctx.fillText(line, x, y);
  }
}

// 保存到历史
function saveToHistory(data) {
  Storage.saveHistory(data);
  alert('已保存到历史记录！');
}

