# 中文版年龄主题内容分享网站

> 最后更新：2025-09-29 - 所有核心功能已完成并正常运行

## 项目简介

这是一个基于年龄主题的内容分享网站，用户可以浏览按年龄分类的人生建议，也可以发布自己的建议给特定年龄群体。项目参考了 [Hey From The Future](https://heyfromthefuture.com/) 网站，并针对中文用户进行了本地化设计。

## 核心功能

### 🎯 年龄导航系统
- 支持7-91岁完整年龄范围（85个年龄段）
- 网格布局展示，每个年龄块显示内容数量
- 响应式设计，移动端友好

### 📝 内容发布系统
- 固定模板："嗨 XX岁，[建议内容]"
- 支持登录和匿名发布
- 发布前需选择作者年龄
- 内容长度限制1000字符

### 👥 用户认证系统
- 用户名+密码注册/登录
- 支持匿名使用
- 登录用户可查看发布历史
- 基于Supabase Auth实现

### 👍 点赞排序系统
- 防重复点赞机制
- 按点赞数降序排列
- 实时计数更新
- 支持匿名点赞

### 📱 响应式设计
- 移动端优先设计
- 触摸友好的交互
- 完美适配各种屏幕尺寸

## 技术栈

### 前端技术
- **Next.js 15** - React全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化CSS框架
- **Shadcn/ui** - 现代化组件库

### 后端技术
- **Supabase** - 开源Firebase替代品
- **PostgreSQL** - 关系型数据库
- **Supabase Auth** - 认证服务
- **Row Level Security** - 数据安全

### 部署技术
- **Cloudflare Pages** - 静态网站托管
- **Cloudflare CDN** - 全球内容分发
- **GitHub Actions** - CI/CD自动化

### 监控工具
- **Vercel Analytics** - 性能分析
- **Sentry** - 错误监控
- **Google Analytics** - 用户行为分析

## 项目结构

```
├── docs/                    # 项目文档
│   ├── 技术实施方案.md
│   ├── 数据库设计.md
│   ├── 前端架构设计.md
│   ├── API接口设计.md
│   └── 部署运维指南.md
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React组件
│   ├── hooks/               # 自定义Hooks
│   ├── lib/                 # 工具库
│   ├── stores/              # 状态管理
│   ├── types/               # TypeScript类型
│   └── utils/               # 工具函数
├── public/                  # 静态资源
├── supabase/               # Supabase配置
│   ├── migrations/         # 数据库迁移
│   └── config.toml         # 配置文件
└── tests/                  # 测试文件
```

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-org/age-wisdom-site.git
cd age-wisdom-site
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的Supabase配置：
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **设置数据库**
```bash
# 安装Supabase CLI
npm install -g supabase

# 登录Supabase
supabase login

# 应用数据库迁移
supabase db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier配置
- 组件使用函数式组件和Hooks
- 使用Tailwind CSS进行样式开发

### 提交规范
```bash
# 功能开发
git commit -m "feat: 添加用户认证功能"

# 问题修复
git commit -m "fix: 修复点赞计数错误"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 优化移动端布局"
```

### 测试
```bash
# 运行单元测试
npm run test

# 运行E2E测试
npm run test:e2e

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 部署指南

### 生产环境部署

1. **配置Cloudflare Pages**
   - 连接GitHub仓库
   - 设置构建命令：`npm run build`
   - 设置输出目录：`dist`

2. **配置环境变量**
   - 在Cloudflare Pages设置中添加环境变量
   - 包括Supabase URL和密钥

3. **自定义域名**
   - 在Cloudflare Pages中添加自定义域名
   - 配置DNS解析

详细部署步骤请参考 [部署运维指南](docs/部署运维指南.md)。

## 文档说明

### 📋 [技术实施方案](docs/技术实施方案.md)
- 项目概述和技术选型
- 成本分析和扩展性考虑
- 开发计划和风险评估

### 🗄️ [数据库设计](docs/数据库设计.md)
- 完整的表结构设计
- 索引和性能优化
- 安全策略和备份方案

### 🎨 [前端架构设计](docs/前端架构设计.md)
- 组件架构和状态管理
- 路由设计和性能优化
- 测试策略和部署配置

### 🔌 [API接口设计](docs/API接口设计.md)
- 完整的API接口规范
- 认证和权限控制
- 错误处理和限流策略

### 🚀 [部署运维指南](docs/部署运维指南.md)
- 环境配置和部署流程
- 监控和日志管理
- 安全配置和故障处理

## 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🎨 优化用户界面

### 贡献流程

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

- 项目维护者：[Your Name](mailto:your-email@domain.com)
- 项目地址：[GitHub Repository](https://github.com/your-org/age-wisdom-site)
- 在线演示：[Demo Site](https://your-domain.com)

## 致谢

- 感谢 [Hey From The Future](https://heyfromthefuture.com/) 提供的设计灵感
- 感谢 [Supabase](https://supabase.com/) 提供的优秀后端服务
- 感谢 [Vercel](https://vercel.com/) 和 [Cloudflare](https://cloudflare.com/) 提供的部署平台
- 感谢所有开源项目的贡献者

## 更新日志

### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- ✨ 完整的年龄主题内容分享功能
- 🔐 用户认证和权限管理
- 📱 响应式设计和移动端优化
- 🚀 生产环境部署

---

**让我们一起分享人生智慧，传递年龄的力量！** 🌟
