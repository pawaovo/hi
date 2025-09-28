# Supabase 设置指南

## 📋 第二阶段任务清单

### 步骤1：创建Supabase项目

1. **访问Supabase官网**
   - 打开 https://supabase.com
   - 点击右上角"Sign in"或"Start your project"

2. **注册/登录账号**
   - 使用GitHub、Google或邮箱注册
   - 建议使用GitHub登录，方便后续CI/CD集成

3. **创建新项目**
   - 点击"New Project"
   - 填写项目信息：
     - **Organization**: 选择或创建组织
     - **Name**: `age-wisdom-site`
     - **Database Password**: 设置强密码（请记住！）
     - **Region**: 选择离您最近的地区（建议选择Singapore或Tokyo）
     - **Pricing Plan**: 选择"Free"计划

4. **等待项目创建**
   - 项目创建需要1-2分钟
   - 创建完成后会自动跳转到项目仪表板

### 步骤2：获取项目配置信息

1. **进入项目设置**
   - 在项目仪表板左侧菜单点击"Settings"
   - 选择"API"选项卡

2. **复制配置信息**
   ```bash
   # 复制以下信息：
   Project URL: https://your-project-id.supabase.co
   anon public key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   service_role key: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... (点击眼睛图标显示)
   ```

### 步骤3：配置本地环境

1. **创建环境变量文件**
   - 在项目根目录创建 `.env.local` 文件
   - 复制以下内容并填入您的配置：

   ```bash
   # Supabase配置
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # 网站配置
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=年龄智慧
   ```

2. **安装Supabase CLI**
   ```bash
   npm install -g supabase
   ```

3. **登录Supabase CLI**
   ```bash
   supabase login
   ```

4. **链接本地项目到远程项目**
   ```bash
   supabase link --project-ref your-project-id
   ```

### 步骤4：应用数据库迁移

1. **推送数据库架构**
   ```bash
   supabase db push
   ```

2. **验证数据库结构**
   - 在Supabase仪表板中点击"Table Editor"
   - 确认以下表已创建：
     - `users` - 用户表
     - `age_posts` - 年龄内容表
     - `post_likes` - 点赞记录表
     - `user_sessions` - 用户会话表
     - `post_views` - 内容浏览记录表

3. **检查测试数据**
   - 在"Table Editor"中查看各表是否有测试数据
   - 特别检查`age_posts`表是否有示例内容

### 步骤5：配置认证设置

1. **进入认证设置**
   - 在Supabase仪表板左侧菜单点击"Authentication"
   - 选择"Settings"选项卡

2. **配置站点URL**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: 添加 `http://localhost:3000/**`

3. **启用邮箱认证**
   - 确保"Enable email confirmations"已启用
   - 可以暂时禁用邮箱确认以便测试

### 步骤6：测试数据库连接

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **测试连接**
   - 打开浏览器访问 http://localhost:3000
   - 检查浏览器控制台是否有连接错误

3. **验证数据显示**
   - 年龄卡片应该显示实际的消息数量
   - 不再是随机数字

## 🔧 故障排除

### 常见问题

1. **连接错误**
   - 检查`.env.local`文件中的URL和密钥是否正确
   - 确保没有多余的空格或引号

2. **权限错误**
   - 检查Row Level Security策略是否正确应用
   - 在Supabase仪表板的"Authentication"中查看用户状态

3. **迁移失败**
   - 检查SQL语法是否正确
   - 查看Supabase仪表板的"Logs"获取详细错误信息

### 有用的命令

```bash
# 查看项目状态
supabase status

# 重置本地数据库
supabase db reset

# 生成TypeScript类型
supabase gen types typescript --local > src/types/supabase.ts

# 查看数据库差异
supabase db diff

# 创建新迁移
supabase migration new migration_name
```

## 📊 验证清单

完成设置后，请确认以下项目：

- [ ] Supabase项目已创建
- [ ] 环境变量已正确配置
- [ ] 数据库表已创建
- [ ] 测试数据已插入
- [ ] Row Level Security已启用
- [ ] 认证设置已配置
- [ ] 本地开发服务器可以连接数据库
- [ ] 网站显示真实的数据统计

## 🎯 下一步

完成Supabase设置后，我们将进入：

**第三阶段：前端基础架构 (第3-4周)**
- 创建布局组件
- 实现年龄导航系统
- 开发基础UI组件
- 配置状态管理

请在完成Supabase设置后告诉我，我将继续指导您进行下一阶段的开发！
