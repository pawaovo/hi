-- =====================================================
-- 年龄智慧网站 - 修复版数据库设置脚本
-- 请在Supabase仪表板的SQL Editor中执行此脚本
-- =====================================================

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 2. 创建年龄内容表
CREATE TABLE IF NOT EXISTS age_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_age INTEGER NOT NULL,
    content TEXT NOT NULL,
    author_age INTEGER NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50),
    like_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    CONSTRAINT target_age_range CHECK (target_age >= 7 AND target_age <= 91),
    CONSTRAINT author_age_range CHECK (author_age >= 7 AND author_age <= 91),
    CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 500)
);

-- 3. 创建点赞记录表
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES age_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建内容浏览记录表
CREATE TABLE IF NOT EXISTS post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES age_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建基础索引
CREATE INDEX IF NOT EXISTS idx_age_posts_target_age ON age_posts(target_age);
CREATE INDEX IF NOT EXISTS idx_age_posts_created_at ON age_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_age_posts_like_count ON age_posts(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_age_posts_active ON age_posts(is_active) WHERE is_active = true;

-- 6. 启用Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- 7. 创建基础RLS策略
DROP POLICY IF EXISTS "Anyone can view active posts" ON age_posts;
CREATE POLICY "Anyone can view active posts" ON age_posts
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
CREATE POLICY "Anyone can view likes" ON post_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view post views" ON post_views;
CREATE POLICY "Anyone can view post views" ON post_views
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create post views" ON post_views;
CREATE POLICY "Anyone can create post views" ON post_views
    FOR INSERT WITH CHECK (true);

-- 8. 插入测试数据
INSERT INTO users (id, username, email, bio, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'wisdom_seeker', 'seeker@example.com', '喜欢分享人生感悟的年轻人', true),
('550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 'mentor@example.com', '经历过人生起伏的中年人', true),
('550e8400-e29b-41d4-a716-446655440003', 'young_dreamer', 'dreamer@example.com', '充满梦想的大学生', true),
('550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 'soul@example.com', '阅历丰富的长者', true)
ON CONFLICT (id) DO NOTHING;

-- 9. 插入测试内容数据
INSERT INTO age_posts (target_age, content, author_age, user_id, username, like_count, view_count) VALUES
-- 给18岁的建议
(18, '珍惜现在的时光，多读书，多思考，不要急于求成', 25, '550e8400-e29b-41d4-a716-446655440001', 'wisdom_seeker', 15, 120),
(18, '勇敢地去尝试，失败了也没关系，年轻就是最大的资本', 30, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 23, 180),
(18, '学会独立思考，不要盲从他人的意见', 35, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 18, 95),
(18, '培养一个终身的爱好，它会陪伴你一生', 28, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 12, 75),

-- 给25岁的建议
(25, '开始规划你的职业生涯，但也要保持灵活性', 32, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 28, 200),
(25, '投资自己的健康，现在开始还不晚', 40, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 35, 250),
(25, '学会理财，让钱为你工作', 35, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 42, 320),
(25, '不要害怕改变，25岁正是探索的好时机', 29, '550e8400-e29b-41d4-a716-446655440001', 'wisdom_seeker', 19, 140),

-- 给30岁的建议
(30, '平衡工作与生活，家庭同样重要', 45, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 38, 280),
(30, '建立自己的人脉网络，但要真诚', 35, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 25, 190),
(30, '开始考虑长期目标，而不只是短期收益', 38, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 31, 220),
(30, '学会说不，保护自己的时间和精力', 33, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 22, 165),

-- 给35岁的建议
(35, '接受自己的不完美，专注于自己的优势', 42, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 45, 350),
(35, '投资于持续学习，时代在变化', 40, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 33, 240),
(35, '珍惜与家人朋友的关系，事业不是全部', 38, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 29, 210),

-- 给40岁的建议
(40, '开始关注健康，定期体检很重要', 50, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 52, 400),
(40, '培养下一代，分享你的经验和智慧', 45, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 36, 290),
(40, '重新审视人生目标，调整方向', 43, '550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 28, 185),

-- 给50岁的建议
(50, '享受人生，你已经努力了这么久', 60, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 48, 380),
(50, '传承你的知识和经验给年轻人', 55, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 41, 310),
(50, '开始规划退休生活，但不要停止学习', 58, '550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 35, 260),

-- 一些匿名发布的内容
(22, '大学毕业后很迷茫，不知道该做什么', 22, NULL, NULL, 8, 65),
(27, '工作压力很大，但还是要坚持', 27, NULL, NULL, 12, 85),
(33, '结婚生子后，感觉生活节奏完全变了', 33, NULL, NULL, 15, 110),
(45, '中年危机是真实存在的，但也是成长的机会', 45, NULL, NULL, 20, 150)
ON CONFLICT DO NOTHING;
