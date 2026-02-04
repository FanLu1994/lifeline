# LifeLine - 失业生存计算器

<div align="center">

一个帮助您计算失业后积蓄能支撑多久的在线计算器。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)

[在线演示](#) • [快速开始](#快速开始) • [功能特性](#功能特性)

</div>

## 简介

LifeLine 是一个简单易用的失业生存计算器，通过分析您的流动资产、月支出、被动收入等数据，计算出在失业情况下您的积蓄可以支撑多久，帮助您做好财务规划和风险预警。

## 功能特性

- 家庭状况配置（婚姻、子女、配偶收入）
- 流动资产管理（现金、银行存款、活期理财）
- 月支出分类记录（居住、必需、生活支出）
- 被动收入计算（房租、利息、股息、补贴等）
- 实时计算可生存时长
- 风险等级评估（安全/良好/预警/危险）
- 暗色/亮色模式切换
- 完全响应式设计，支持移动端

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/) - React 全栈框架
- **语言**: [TypeScript](https://www.typescriptlang.org/) - 类型安全
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS
- **运行时**: Node.js

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn 或 pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/lifeline.git
cd lifeline

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
# 生产环境构建
npm run build
# 或
yarn build
# 或
pnpm build
```

## 项目结构

```
lifeline/
├── src/
│   └── app/
│       ├── layout.tsx      # 根布局
│       ├── page.tsx        # 主页面（计算器）
│       └── globals.css     # 全局样式
├── public/                 # 静态资源
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目配置
```

## 使用说明

1. **设置家庭状况**: 选择是否已婚、是否有子女，配置家庭成员信息
2. **输入流动资产**: 填写现金、银行存款、活期理财等流动资产
3. **记录月支出**: 分类填写每月的各项支出
4. **添加被动收入**: 记录房租、利息、股息等被动收入
5. **查看结果**: 右侧面板实时显示可生存时长和风险等级

## 数据来源

- 国家统计局消费支出分类
- 中国家庭金融调查 (CHFS)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT](LICENSE)

## 致谢

感谢所有为这个项目做出贡献的人。

---

<div align="center">
 Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</div>
