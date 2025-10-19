// 配置文件
const CONFIG = {
  // API 端点配置
  API_BASE_URL: 'http://localhost:3000/api',
  
  // 视频资源配置
  WELCOME_VIDEO: '第一页16比9带logohd.mp4',  // 欢迎页视频底图路径
  TRANSITION_VIDEO: '加白转场v2.mp4',  // 过渡页视频路径
  BACKGROUND_VIDEO: '第二页16比9-1.mp4',  // 拍摄页视频底图路径
  LOADING_VIDEO: '第二页16比9-1.mp4',  // 加载页预加载视频路径（临时使用底图视频）
  
  // 结果页 UI 配置
  RESULT_UI_IMAGE: 'assets/images/result-ui.png',  // 结果页 UI 框架图片路径
  
  // 结果页内容布局配置（使用百分比，相对于 UI 图片容器）
  RESULT_LAYOUT: {
    originalImage: { 
      top: '10%', 
      left: '5%', 
      width: '30%', 
      height: '40%' 
    },
    agedImagesCarousel: { 
      top: '10%', 
      left: '40%', 
      width: '55%', 
      height: '40%' 
    },
    marriageText: { 
      top: '55%', 
      left: '5%', 
      width: '28%', 
      height: 'auto',
      fontSize: '14px',
      color: '#333333'
    },
    careerText: { 
      top: '55%', 
      left: '36%', 
      width: '28%', 
      height: 'auto',
      fontSize: '14px',
      color: '#333333'
    },
    wealthText: { 
      top: '55%', 
      left: '67%', 
      width: '28%', 
      height: 'auto',
      fontSize: '14px',
      color: '#333333'
    }
  },
  
  // 其他配置
  MAX_IMAGE_SIZE: 1024 * 1024,  // 1MB
  RETRY_TIMES: 2,
  REQUEST_TIMEOUT: 30000,  // 30秒
  
  // Mock 模式（开发时使用）
  MOCK_MODE: true,  // 设置为 true 时使用模拟数据
  
  // 调试模式
  USE_SIMPLE_RESULT: true  // 使用简化版结果页便于调试
};

