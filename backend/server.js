const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 路由
const analysisRouter = require('./routes/analysis');

app.use('/api/face/analyze', analysisRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FaceCode API is running' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    error: err.message || 'Internal server error'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Not found'
  });
});

app.listen(PORT, () => {
  console.log(`FaceCode backend server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

