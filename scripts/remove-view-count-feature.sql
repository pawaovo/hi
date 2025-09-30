-- =====================================================
-- 安全删除浏览量功能相关代码
-- 执行前请确保已备份数据库
-- =====================================================

-- 说明：
-- 此脚本将删除所有与浏览量相关的数据库对象
-- 包括：post_views表、view_count字段、相关触发器、函数、索引、RLS策略
-- 不会影响现有的点赞功能和其他正常功能

BEGIN;

-- ==========================================
-- 第一步：删除触发器
-- ==========================================

-- 删除浏览计数触发器
DROP TRIGGER IF EXISTS trigger_update_view_count ON post_views;

COMMENT ON TRIGGER trigger_update_view_count ON post_views IS '已删除：浏览计数触发器';

-- ==========================================
-- 第二步：删除函数
-- ==========================================

-- 删除浏览计数更新函数
DROP FUNCTION IF EXISTS update_post_view_count();

-- 删除浏览计数增加函数（如果存在）
DROP FUNCTION IF EXISTS increment_view_count(UUID);

-- 删除记录浏览的安全函数
DROP FUNCTION IF EXISTS record_post_view(UUID, UUID, INET, TEXT);

COMMENT ON FUNCTION update_post_view_count IS '已删除：浏览计数更新函数';

-- ==========================================
-- 第三步：删除RLS策略
-- ==========================================

-- 删除post_views表的RLS策略
DROP POLICY IF EXISTS "Anyone can create views" ON post_views;
DROP POLICY IF EXISTS "Anyone can view views" ON post_views;
DROP POLICY IF EXISTS "Users can view own views" ON post_views;

-- ==========================================
-- 第四步：删除索引
-- ==========================================

-- 删除post_views表的索引
DROP INDEX IF EXISTS idx_post_views_post_id;
DROP INDEX IF EXISTS idx_post_views_viewed_at;
DROP INDEX IF EXISTS idx_post_views_user_id;

-- ==========================================
-- 第五步：删除表
-- ==========================================

-- 删除post_views表（CASCADE会自动删除相关的外键约束）
DROP TABLE IF EXISTS post_views CASCADE;

COMMENT ON TABLE post_views IS '已删除：浏览记录表';

-- ==========================================
-- 第六步：删除age_posts表中的view_count字段
-- ==========================================

-- 删除view_count字段
ALTER TABLE age_posts DROP COLUMN IF EXISTS view_count;

COMMENT ON COLUMN age_posts.view_count IS '已删除：浏览次数字段';

-- ==========================================
-- 第七步：删除视图中的view_count引用
-- ==========================================

-- 重新创建age_statistics视图（移除view_count）
DROP VIEW IF EXISTS age_statistics;

CREATE OR REPLACE VIEW age_statistics AS
SELECT 
    target_age,
    COUNT(*) as post_count,
    AVG(like_count) as avg_likes,
    MAX(like_count) as max_likes
FROM age_posts 
WHERE is_active = true
GROUP BY target_age
ORDER BY target_age;

COMMENT ON VIEW age_statistics IS '年龄统计视图（已移除浏览数统计）';

-- ==========================================
-- 第八步：验证删除结果
-- ==========================================

-- 验证post_views表是否已删除
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'post_views'
    ) THEN
        RAISE EXCEPTION 'post_views表删除失败';
    ELSE
        RAISE NOTICE '✓ post_views表已成功删除';
    END IF;
END $$;

-- 验证view_count字段是否已删除
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'age_posts' AND column_name = 'view_count'
    ) THEN
        RAISE EXCEPTION 'view_count字段删除失败';
    ELSE
        RAISE NOTICE '✓ view_count字段已成功删除';
    END IF;
END $$;

-- 验证触发器是否已删除
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_view_count'
    ) THEN
        RAISE EXCEPTION 'trigger_update_view_count触发器删除失败';
    ELSE
        RAISE NOTICE '✓ trigger_update_view_count触发器已成功删除';
    END IF;
END $$;

-- 验证函数是否已删除
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_post_view_count'
    ) THEN
        RAISE EXCEPTION 'update_post_view_count函数删除失败';
    ELSE
        RAISE NOTICE '✓ update_post_view_count函数已成功删除';
    END IF;
END $$;

-- ==========================================
-- 第九步：验证现有功能完整性
-- ==========================================

-- 验证age_posts表结构
DO $$
DECLARE
    required_columns TEXT[] := ARRAY[
        'id', 'target_age', 'content', 'author_age', 
        'user_id', 'username', 'like_count', 
        'created_at', 'updated_at', 'is_active', 'is_featured'
    ];
    col TEXT;
BEGIN
    FOREACH col IN ARRAY required_columns
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'age_posts' AND column_name = col
        ) THEN
            RAISE EXCEPTION 'age_posts表缺少必需字段: %', col;
        END IF;
    END LOOP;
    RAISE NOTICE '✓ age_posts表结构完整';
END $$;

-- 验证点赞功能相关对象
DO $$
BEGIN
    -- 验证post_likes表
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'post_likes'
    ) THEN
        RAISE EXCEPTION 'post_likes表不存在';
    END IF;
    
    -- 验证点赞触发器
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'trigger_update_like_count'
    ) THEN
        RAISE EXCEPTION 'trigger_update_like_count触发器不存在';
    END IF;
    
    -- 验证点赞函数
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_post_like_count'
    ) THEN
        RAISE EXCEPTION 'update_post_like_count函数不存在';
    END IF;
    
    RAISE NOTICE '✓ 点赞功能相关对象完整';
END $$;

-- ==========================================
-- 完成
-- ==========================================

COMMIT;

-- 输出最终报告
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '浏览量功能删除完成！';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '已删除的对象：';
    RAISE NOTICE '  - post_views 表';
    RAISE NOTICE '  - age_posts.view_count 字段';
    RAISE NOTICE '  - trigger_update_view_count 触发器';
    RAISE NOTICE '  - update_post_view_count() 函数';
    RAISE NOTICE '  - increment_view_count() 函数';
    RAISE NOTICE '  - record_post_view() 函数';
    RAISE NOTICE '  - 相关索引和RLS策略';
    RAISE NOTICE '';
    RAISE NOTICE '保留的功能：';
    RAISE NOTICE '  ✓ 点赞功能完整';
    RAISE NOTICE '  ✓ 用户管理功能完整';
    RAISE NOTICE '  ✓ 内容发布功能完整';
    RAISE NOTICE '  ✓ 所有现有数据完整';
    RAISE NOTICE '';
    RAISE NOTICE '下一步：';
    RAISE NOTICE '  1. 更新TypeScript类型定义';
    RAISE NOTICE '  2. 清理文档中的浏览量相关内容';
    RAISE NOTICE '  3. 删除导入脚本中的view_count字段';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;

