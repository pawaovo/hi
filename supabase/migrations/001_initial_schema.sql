-- 创建用户表
CREATE TABLE users (
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
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3),
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL)
);

-- 创建年龄内容表
CREATE TABLE age_posts (
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

-- 创建点赞记录表
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES age_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 防止重复点赞：同一用户或同一IP+User-Agent组合只能点赞一次
    CONSTRAINT unique_user_like UNIQUE (post_id, user_id),
    CONSTRAINT unique_anonymous_like UNIQUE (post_id, ip_address, user_agent)
);

-- 创建用户会话表
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- 创建内容浏览记录表
CREATE TABLE post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES age_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 防止重复计数：同一用户或IP在短时间内的重复浏览不计数
    CONSTRAINT unique_user_view UNIQUE (post_id, user_id, DATE(viewed_at)),
    CONSTRAINT unique_anonymous_view UNIQUE (post_id, ip_address, DATE(viewed_at))
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_age_posts_target_age ON age_posts(target_age);
CREATE INDEX idx_age_posts_created_at ON age_posts(created_at);
CREATE INDEX idx_age_posts_like_count ON age_posts(like_count DESC);
CREATE INDEX idx_age_posts_user_id ON age_posts(user_id);
CREATE INDEX idx_age_posts_active ON age_posts(is_active) WHERE is_active = true;

-- 复合索引用于排序和筛选
CREATE INDEX idx_age_posts_target_age_likes ON age_posts(target_age, like_count DESC, created_at DESC);
CREATE INDEX idx_age_posts_target_age_time ON age_posts(target_age, created_at DESC);

CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_likes_created_at ON post_likes(created_at);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_user_id ON post_views(user_id);
CREATE INDEX idx_post_views_viewed_at ON post_views(viewed_at);

-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_age_posts_updated_at BEFORE UPDATE ON age_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
