-- 启用Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- 用户表策略
-- 用户只能查看自己的完整信息，其他用户只能看到公开信息
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 年龄内容表策略
-- 所有人都可以查看活跃的内容
CREATE POLICY "Anyone can view active posts" ON age_posts
    FOR SELECT USING (is_active = true);

-- 登录用户可以创建内容
CREATE POLICY "Authenticated users can create posts" ON age_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的内容
CREATE POLICY "Users can update own posts" ON age_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- 用户只能删除自己的内容（通过设置is_active = false）
CREATE POLICY "Users can delete own posts" ON age_posts
    FOR UPDATE USING (auth.uid() = user_id);

-- 点赞记录表策略
-- 用户可以查看所有点赞记录
CREATE POLICY "Anyone can view likes" ON post_likes
    FOR SELECT USING (true);

-- 登录用户可以创建点赞记录
CREATE POLICY "Authenticated users can like posts" ON post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 用户只能删除自己的点赞记录
CREATE POLICY "Users can delete own likes" ON post_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 用户会话表策略
-- 用户只能查看自己的会话
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- 内容浏览记录表策略
-- 用户可以查看所有浏览记录（用于统计）
CREATE POLICY "Anyone can view post views" ON post_views
    FOR SELECT USING (true);

-- 任何人都可以创建浏览记录
CREATE POLICY "Anyone can create post views" ON post_views
    FOR INSERT WITH CHECK (true);

-- 创建安全函数：检查用户是否可以点赞
CREATE OR REPLACE FUNCTION can_like_post(post_uuid UUID, user_uuid UUID DEFAULT NULL, user_ip INET DEFAULT NULL, user_agent_string TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    existing_like_count INTEGER;
BEGIN
    -- 检查是否已经点赞过
    IF user_uuid IS NOT NULL THEN
        SELECT COUNT(*) INTO existing_like_count
        FROM post_likes
        WHERE post_id = post_uuid AND user_id = user_uuid;
    ELSE
        SELECT COUNT(*) INTO existing_like_count
        FROM post_likes
        WHERE post_id = post_uuid 
            AND ip_address = user_ip 
            AND user_agent = user_agent_string;
    END IF;
    
    RETURN existing_like_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建安全函数：安全地创建点赞记录
CREATE OR REPLACE FUNCTION safe_like_post(
    post_uuid UUID,
    user_uuid UUID DEFAULT NULL,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    can_like BOOLEAN;
    like_id UUID;
BEGIN
    -- 检查是否可以点赞
    SELECT can_like_post(post_uuid, user_uuid, user_ip, user_agent_string) INTO can_like;
    
    IF NOT can_like THEN
        RETURN FALSE;
    END IF;
    
    -- 创建点赞记录
    INSERT INTO post_likes (post_id, user_id, ip_address, user_agent)
    VALUES (post_uuid, user_uuid, user_ip, user_agent_string)
    RETURNING id INTO like_id;
    
    RETURN like_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建安全函数：安全地取消点赞
CREATE OR REPLACE FUNCTION safe_unlike_post(
    post_uuid UUID,
    user_uuid UUID DEFAULT NULL,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    IF user_uuid IS NOT NULL THEN
        DELETE FROM post_likes
        WHERE post_id = post_uuid AND user_id = user_uuid;
    ELSE
        DELETE FROM post_likes
        WHERE post_id = post_uuid 
            AND ip_address = user_ip 
            AND user_agent = user_agent_string;
    END IF;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建安全函数：记录内容浏览
CREATE OR REPLACE FUNCTION record_post_view(
    post_uuid UUID,
    user_uuid UUID DEFAULT NULL,
    user_ip INET DEFAULT NULL,
    user_agent_string TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    view_id UUID;
BEGIN
    -- 尝试插入浏览记录，如果已存在则忽略
    INSERT INTO post_views (post_id, user_id, ip_address, user_agent)
    VALUES (post_uuid, user_uuid, user_ip, user_agent_string)
    ON CONFLICT DO NOTHING
    RETURNING id INTO view_id;
    
    RETURN view_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
