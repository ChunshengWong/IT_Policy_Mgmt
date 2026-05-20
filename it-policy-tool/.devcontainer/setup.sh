#!/bin/bash

echo "🚀 安装后端依赖..."
cd backend && npm install && npx prisma generate && cd ..

echo "🚀 安装前端依赖..."
cd frontend && npm install && cd ..

echo "✅ 设置完成！"
echo ""
echo "启动服务："
echo "  后端: cd backend && npm run dev"
echo "  前端: cd frontend && npm start"
