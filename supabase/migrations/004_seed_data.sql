-- 插入测试用户数据
INSERT INTO users (id, username, email, bio, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'wisdom_seeker', 'seeker@example.com', '喜欢分享人生感悟的年轻人', true),
('550e8400-e29b-41d4-a716-446655440002', 'life_mentor', 'mentor@example.com', '经历过人生起伏的中年人', true),
('550e8400-e29b-41d4-a716-446655440003', 'young_dreamer', 'dreamer@example.com', '充满梦想的大学生', true),
('550e8400-e29b-41d4-a716-446655440004', 'experienced_soul', 'soul@example.com', '阅历丰富的长者', true);

-- 插入测试内容数据
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
(45, '中年危机是真实存在的，但也是成长的机会', 45, NULL, NULL, 20, 150);

-- 插入一些点赞记录
INSERT INTO post_likes (post_id, user_id) 
SELECT ap.id, u.id
FROM age_posts ap
CROSS JOIN users u
WHERE random() < 0.3  -- 30%的概率创建点赞记录
AND ap.user_id != u.id; -- 不能给自己的内容点赞

-- 插入一些浏览记录
INSERT INTO post_views (post_id, user_id)
SELECT ap.id, u.id
FROM age_posts ap
CROSS JOIN users u
WHERE random() < 0.8; -- 80%的概率创建浏览记录

-- 更新统计数据以匹配实际的点赞和浏览记录
UPDATE age_posts SET 
    like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = age_posts.id),
    view_count = (SELECT COUNT(*) FROM post_views WHERE post_id = age_posts.id);

-- 创建一些年龄段的统计视图
CREATE OR REPLACE VIEW age_statistics AS
SELECT 
    target_age,
    COUNT(*) as post_count,
    AVG(like_count) as avg_likes,
    MAX(like_count) as max_likes,
    SUM(view_count) as total_views
FROM age_posts 
WHERE is_active = true
GROUP BY target_age
ORDER BY target_age;
