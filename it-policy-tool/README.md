# IT制度管理工具

金融公司IT制度管理系统，支持制度、标准和SOP三级管理，以及与监管要求的合规对比。

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Express + TypeScript + Prisma ORM
- **数据库**: SQLite（开发）/ PostgreSQL（生产）

## 快速开始

### 1. 克隆项目
```bash
git clone <您的仓库地址>
cd it-policy-tool
```

### 2. 启动后端
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. 启动前端（新开终端）
```bash
cd frontend
npm install
npm start
```

### 4. 访问应用
- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

## 功能

- 📊 仪表盘 - 统计概览和合规率
- 📋 制度管理 - 三级制度架构管理
- 📜 监管要求 - 监管要求录入和分类
- 🔍 合规对比 - 人工对比监管要求与IT制度
