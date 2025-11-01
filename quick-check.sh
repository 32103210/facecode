#!/bin/bash

# LLM修复快速检查脚本

echo "🔍 LLM修复检查脚本"
echo "===================="
echo ""

# 检查1：文件是否创建
echo "📁 检查1：文件创建状态"
echo "----------------------"

files=(
  "prompt/simple_system_prompt.txt"
  "LLM_FIX_COMPLETE.md"
  "test-llm-fix.md"
  "LLM修复总结.md"
  "检查清单.md"
)

all_files_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (不存在)"
    all_files_exist=false
  fi
done

echo ""

# 检查2：后端关键代码
echo "🔧 检查2：后端代码修改"
echo "----------------------"

if grep -q "simple_system_prompt.txt" backend/controllers/analysisController.js; then
  echo "✅ 使用简化版prompt"
else
  echo "❌ 未使用简化版prompt"
fi

if grep -q "parseAIResponse" backend/controllers/analysisController.js; then
  echo "✅ parseAIResponse 函数存在"
else
  echo "❌ parseAIResponse 函数不存在"
fi

if grep -q "validateAnalysisStructure" backend/controllers/analysisController.js; then
  echo "✅ validateAnalysisStructure 函数存在"
else
  echo "❌ validateAnalysisStructure 函数不存在"
fi

echo ""

# 检查3：前端配置
echo "⚙️  检查3：前端配置"
echo "----------------------"

if grep -q "DEBUG_MODE" js/config.js; then
  echo "✅ DEBUG_MODE 配置已添加"
else
  echo "❌ DEBUG_MODE 配置未添加"
fi

if grep -q "MOCK_MODE" js/config.js; then
  echo "✅ MOCK_MODE 配置存在"
else
  echo "❌ MOCK_MODE 配置不存在"
fi

echo ""

# 检查4：依赖安装
echo "📦 检查4：后端依赖"
echo "----------------------"

if [ -d "backend/node_modules" ]; then
  echo "✅ node_modules 已安装"
else
  echo "⚠️  node_modules 未安装，请运行: cd backend && npm install"
fi

echo ""

# 检查5：配置状态
echo "🎯 检查5：当前配置"
echo "----------------------"

mock_mode=$(grep "MOCK_MODE:" js/config.js | grep -v "//" | head -1)
debug_mode=$(grep "DEBUG_MODE:" js/config.js | grep -v "//" | head -1)

echo "当前配置："
echo "  $mock_mode"
echo "  $debug_mode"

echo ""

# 总结
echo "📊 检查总结"
echo "===================="

if [ "$all_files_exist" = true ]; then
  echo "✅ 所有文件已创建"
else
  echo "❌ 部分文件缺失"
fi

echo ""
echo "📚 下一步："
echo "1. 查看详细说明: cat LLM修复总结.md"
echo "2. 查看检查清单: cat 检查清单.md"
echo "3. 启动测试:"
echo "   - Mock模式: python3 -m http.server 8000"
echo "   - 真实API: cd backend && npm start (新终端)"
echo ""
echo "🔍 调试技巧："
echo "   在js/config.js中设置 DEBUG_MODE: true"
echo "   然后在浏览器控制台查看详细日志"
echo ""





