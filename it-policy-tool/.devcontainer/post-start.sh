#!/bin/bash

# 启动后端服务
cd backend
npx prisma migrate dev --name init 2>/dev/null || echo "数据库已存在"
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动！"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务"

# 保持脚本运行
wait
