# 🚀 部署指南

## 概述

本指南将帮助您将年龄智慧网站部署到生产环境。我们使用 Cloudflare Pages 作为部署平台，Supabase 作为后端服务。

## 📋 部署前检查清单

### ✅ 已完成
- [x] 项目构建成功
- [x] 代码优化完成
- [x] Next.js 配置已更新
- [x] GitHub Actions 工作流已配置
- [x] 数据库迁移文件已准备

### ❌ 需要完成
- [ ] 创建 Supabase 生产项目
- [ ] 配置生产环境变量
- [ ] 设置 Cloudflare Pages 项目
- [ ] 配置 GitHub Secrets
- [ ] 执行数据库迁移
- [ ] 测试部署

## 🔧 第一步：创建 Supabase 生产项目

1. **访问 Supabase 控制台**
   - 前往 https://supabase.com/dashboard
   - 登录您的账户

2. **创建新项目**
   - 点击 "New Project"
   - 选择组织
   - 输入项目名称：`age-wisdom-production`
   - 选择数据库密码
   - 选择地区（建议选择离用户最近的地区）

3. **获取项目配置**
   - 项目创建完成后，前往 Settings > API
   - 复制以下信息：
     - Project URL
     - anon public key
     - service_role secret key

## 🔧 第二步：配置 GitHub Secrets

在您的 GitHub 仓库中设置以下 Secrets：

1. **前往 GitHub 仓库设置**
   - 进入仓库 > Settings > Secrets and variables > Actions

2. **添加以下 Secrets**：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
   CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
   ```

## 🔧 第三步：设置 Cloudflare Pages

1. **登录 Cloudflare Dashboard**
   - 前往 https://dash.cloudflare.com/
   - 选择您的账户

2. **创建 Pages 项目**
   - 进入 Pages 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择您的 GitHub 仓库

3. **配置构建设置**
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/`

4. **设置环境变量**
   - 在 Pages 项目设置中添加环境变量
   - 添加与 GitHub Secrets 相同的变量

## 🔧 第四步：执行数据库迁移

1. **安装 Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **登录 Supabase**
   ```bash
   supabase login
   ```

3. **链接到生产项目**
   ```bash
   supabase link --project-ref your-production-project-id
   ```

4. **推送数据库架构**
   ```bash
   supabase db push
   ```

## 🔧 第五步：部署到生产环境

1. **推送代码到 main 分支**
   ```bash
   git add .
   git commit -m "feat: 配置生产环境部署"
   git push origin main
   ```

2. **监控部署过程**
   - 在 GitHub Actions 中查看部署状态
   - 在 Cloudflare Pages 中查看构建日志

3. **验证部署**
   - 访问您的域名
   - 测试主要功能：
     - 用户注册/登录
     - 发布内容
     - 点赞功能
     - 浏览年龄页面

## 🔧 第六步：配置自定义域名（可选）

1. **在 Cloudflare Pages 中添加自定义域名**
   - 进入 Pages 项目 > Custom domains
   - 添加您的域名

2. **配置 DNS**
   - 将域名的 CNAME 记录指向 Cloudflare Pages

## 🔧 第七步：设置监控和分析

1. **配置错误监控**
   - 可选：集成 Sentry 进行错误追踪

2. **配置性能监控**
   - 可选：集成 Vercel Analytics

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量是否正确设置
   - 查看构建日志中的错误信息

2. **数据库连接失败**
   - 验证 Supabase URL 和 API 密钥
   - 检查数据库迁移是否成功

3. **页面无法访问**
   - 检查 Cloudflare Pages 部署状态
   - 验证域名配置

### 回滚策略

如果部署出现问题，可以：
1. 在 Cloudflare Pages 中回滚到上一个版本
2. 在 GitHub 中 revert 有问题的提交

## 📞 支持

如果遇到问题，请：
1. 查看项目文档
2. 检查 GitHub Issues
3. 联系技术支持

---

部署完成后，您的年龄智慧网站就可以为用户提供服务了！🎉
