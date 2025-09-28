-- =====================================================
-- 数据库性能优化 - 索引和查询优化
-- =====================================================

-- 1. 为age_posts表添加复合索引，优化常用查询
-- 按年龄和点赞数排序的查询优化
CREATE INDEX IF NOT EXISTS idx_age_posts_target_age_likes 
ON age_posts(target_age, like_count DESC, created_at DESC) 
WHERE is_active = true;

-- 按用户ID查询的优化（用户历史记录）
CREATE INDEX IF NOT EXISTS idx_age_posts_user_id_created 
ON age_posts(user_id, created_at DESC) 
WHERE is_active = true;

-- 按创建时间排序的查询优化
CREATE INDEX IF NOT EXISTS idx_age_posts_created_at 
ON age_posts(created_at DESC) 
WHERE is_active = true;

-- 2. 为post_likes表添加索引，优化点赞查询
-- 防重复点赞查询优化
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user 
ON post_likes(post_id, user_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_ip 
ON post_likes(post_id, ip_address);

-- 3. 为users表添加索引
-- 用户名查询优化
CREATE INDEX IF NOT EXISTS idx_users_username 
ON users(username) 
WHERE is_active = true;

-- 邮箱查询优化
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email) 
WHERE is_active = true;

-- 4. 创建物化视图用于统计查询（可选，如果需要更高性能）
-- 年龄统计视图
CREATE MATERIALIZED VIEW IF NOT EXISTS age_statistics AS
SELECT 
    target_age,
    COUNT(*) as post_count,
    SUM(like_count) as total_likes,
    AVG(like_count) as avg_likes,
    MAX(created_at) as latest_post
FROM age_posts 
WHERE is_active = true 
GROUP BY target_age
ORDER BY target_age;

-- 创建刷新函数
CREATE OR REPLACE FUNCTION refresh_age_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW age_statistics;
END;
$$ LANGUAGE plpgsql;

-- 5. 优化现有函数
-- 优化年龄统计函数，使用索引
CREATE OR REPLACE FUNCTION get_age_statistics()
RETURNS TABLE(
    target_age INTEGER,
    post_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.target_age,
        COUNT(*)::BIGINT as post_count
    FROM age_posts ap
    WHERE ap.is_active = true
    GROUP BY ap.target_age
    ORDER BY ap.target_age;
END;
$$ LANGUAGE plpgsql;

-- 6. 添加分区（如果数据量很大）
-- 按年份分区age_posts表（可选）
-- CREATE TABLE age_posts_y2024 PARTITION OF age_posts
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 7. 分析表统计信息
ANALYZE age_posts;
ANALYZE post_likes;
ANALYZE users;

-- 8. 查看索引使用情况的查询（用于监控）
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- 9. 清理未使用的索引（定期维护）
-- DROP INDEX IF EXISTS old_unused_index;

COMMIT;
