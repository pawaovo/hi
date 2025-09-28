-- 点赞计数更新函数
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE age_posts 
        SET like_count = like_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE age_posts 
        SET like_count = like_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 浏览计数更新函数
CREATE OR REPLACE FUNCTION update_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE age_posts 
    SET view_count = view_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 获取年龄统计函数
CREATE OR REPLACE FUNCTION get_age_stats()
RETURNS TABLE(
    age INTEGER,
    post_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.target_age as age,
        COUNT(*) as post_count
    FROM age_posts ap
    WHERE ap.is_active = true
    GROUP BY ap.target_age
    ORDER BY ap.target_age;
END;
$$ LANGUAGE plpgsql;

-- 获取用户统计函数
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
    posts_count BIGINT,
    likes_received BIGINT,
    likes_given BIGINT,
    joined_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM age_posts WHERE user_id = user_uuid AND is_active = true) as posts_count,
        (SELECT COALESCE(SUM(like_count), 0) FROM age_posts WHERE user_id = user_uuid AND is_active = true) as likes_received,
        (SELECT COUNT(*) FROM post_likes WHERE user_id = user_uuid) as likes_given,
        (SELECT created_at FROM users WHERE id = user_uuid) as joined_date;
END;
$$ LANGUAGE plpgsql;

-- 获取热门内容函数
CREATE OR REPLACE FUNCTION get_trending_posts(days_back INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    target_age INTEGER,
    content TEXT,
    author_age INTEGER,
    username VARCHAR(50),
    like_count INTEGER,
    view_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    trend_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.id,
        ap.target_age,
        ap.content,
        ap.author_age,
        ap.username,
        ap.like_count,
        ap.view_count,
        ap.created_at,
        -- 趋势分数：结合点赞数、浏览数和时间衰减
        (ap.like_count * 2 + ap.view_count * 0.1) * 
        EXP(-EXTRACT(EPOCH FROM (NOW() - ap.created_at)) / (days_back * 24 * 3600)) as trend_score
    FROM age_posts ap
    WHERE ap.is_active = true 
        AND ap.created_at >= NOW() - INTERVAL '%s days' % days_back
    ORDER BY trend_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 清理过期会话函数
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trigger_update_like_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER trigger_update_view_count
    AFTER INSERT ON post_views
    FOR EACH ROW EXECUTE FUNCTION update_post_view_count();

-- 创建定时任务清理过期会话（需要pg_cron扩展）
-- SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');

-- 创建全文搜索索引
CREATE INDEX idx_age_posts_content_search ON age_posts USING gin(to_tsvector('chinese', content));

-- 创建内容搜索函数
CREATE OR REPLACE FUNCTION search_posts(
    search_query TEXT,
    target_age_filter INTEGER DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    target_age INTEGER,
    content TEXT,
    author_age INTEGER,
    username VARCHAR(50),
    like_count INTEGER,
    view_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.id,
        ap.target_age,
        ap.content,
        ap.author_age,
        ap.username,
        ap.like_count,
        ap.view_count,
        ap.created_at,
        ts_rank(to_tsvector('chinese', ap.content), plainto_tsquery('chinese', search_query)) as rank
    FROM age_posts ap
    WHERE ap.is_active = true
        AND to_tsvector('chinese', ap.content) @@ plainto_tsquery('chinese', search_query)
        AND (target_age_filter IS NULL OR ap.target_age = target_age_filter)
    ORDER BY rank DESC, ap.like_count DESC, ap.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
