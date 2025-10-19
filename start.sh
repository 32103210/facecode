#!/bin/bash

echo "========================================="
echo "  FaceCode｜面码 - 启动脚本"
echo "========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 启动后端
echo "📦 启动后端服务..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📥 安装后端依赖..."
    npm install
fi

# 创建 .env 文件（如果不存在）
if [ ! -f ".env" ]; then
    echo "📝 创建 .env 文件..."
    cp env.example .env 2>/dev/null || echo "PORT=3000" > .env
fi

# 后台启动后端
echo "🚀 启动后端服务器..."
npm start &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

cd ..

# 等待后端启动
sleep 3

# 启动前端
echo ""
echo "🌐 启动前端服务..."

if command -v python3 &> /dev/null; then
    echo "使用 Python3 启动前端服务器..."
    echo "前端地址: http://localhost:8000"
    echo "后端地址: http://localhost:3000"
    echo ""
    echo "按 Ctrl+C 停止服务"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "使用 Python 启动前端服务器..."
    echo "前端地址: http://localhost:8000"
    echo "后端地址: http://localhost:3000"
    echo ""
    echo "按 Ctrl+C 停止服务"
    echo ""
    python -m http.server 8000
else
    echo "❌ 未找到 Python，请手动启动前端服务器"
    echo "或使用: npx serve"
fi

# 清理后台进程
trap "kill $BACKEND_PID 2>/dev/null" EXIT

