#!/bin/bash

echo "🚀 启动数学秒杀管理后台"
echo ""

# 检查node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 首次运行，安装依赖..."
  npm install
fi

echo "✅ 启动开发服务器..."
npm run dev
