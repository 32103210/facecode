// Canvas 绘图模块（用于生成分享图片）

const CanvasHelper = {
  // 创建分享图片
  async createShareImage(data, canvas) {
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = 1080;
    canvas.height = 1920;

    // 绘制背景
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制标题
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 48px Arial, "Microsoft YaHei"';
    ctx.textAlign = 'center';
    ctx.fillText('FaceCode｜面码', canvas.width / 2, 80);

    try {
      // 加载原始图片
      const originalImg = await this.loadImage(data.originalImage);
      const imgWidth = 400;
      const imgHeight = (originalImg.height / originalImg.width) * imgWidth;
      
      // 绘制原始图片
      ctx.drawImage(originalImg, 100, 150, imgWidth, imgHeight);

      // 绘制变老图片
      if (data.agedImages && data.agedImages.length > 0) {
        const agedImg = await this.loadImage(data.agedImages[0].url);
        ctx.drawImage(agedImg, 580, 150, imgWidth, imgHeight);
      }

      // 绘制文字内容
      let y = 150 + imgHeight + 80;
      
      // 姻缘
      y = this.drawTextSection(ctx, '姻缘', data.analysis.marriage, 100, y, 880);
      
      // 事业
      y = this.drawTextSection(ctx, '事业', data.analysis.career, 100, y, 880);
      
      // 财运
      this.drawTextSection(ctx, '财运', data.analysis.wealth, 100, y, 880);

      // 底部信息
      ctx.font = '20px Arial';
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.fillText('扫码体验更多', canvas.width / 2, canvas.height - 50);

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('生成分享图片失败:', error);
      throw error;
    }
  },

  // 加载图片
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // 绘制文字区块
  drawTextSection(ctx, title, content, x, y, maxWidth) {
    // 标题
    ctx.font = 'bold 28px Arial, "Microsoft YaHei"';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'left';
    ctx.fillText(title, x, y);
    y += 40;

    // 内容
    ctx.font = '20px Arial, "Microsoft YaHei"';
    ctx.fillStyle = '#555';
    y = this.wrapText(ctx, content, x, y, maxWidth, 30, 4);
    
    return y + 40; // 返回下一个区块的起始位置
  },

  // 文字换行
  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 999) {
    const chars = text.split('');
    let line = '';
    let lineCount = 0;

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, y);
        line = chars[i];
        y += lineHeight;
        lineCount++;
        
        if (lineCount >= maxLines) {
          ctx.fillText(line + '...', x, y);
          return y;
        }
      } else {
        line = testLine;
      }
    }
    
    if (line.length > 0 && lineCount < maxLines) {
      ctx.fillText(line, x, y);
      y += lineHeight;
    }
    
    return y;
  }
};

