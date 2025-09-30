/**
 * 从Markdown文件导入消息到数据库
 * 
 * 使用方法:
 * node scripts/import-messages.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 读取.env.local文件
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

const env = loadEnvFile();

// Supabase配置
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 缺少Supabase配置');
  console.error('请确保.env.local文件中包含:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 解析Markdown文件，提取年龄和消息
 * @param {string} filePath - Markdown文件路径
 * @returns {Array<{age: number, messages: string[]}>}
 */
function parseMarkdownFile(filePath) {
  console.log(`\n📖 正在读取文件: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const ageGroups = [];
  let currentAge = null;
  let currentMessages = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 检测年龄标题: "嘿，XX岁的你"
    const ageMatch = line.match(/^嘿[,，]\s*(\d+)\s*岁的你/);
    
    if (ageMatch) {
      // 保存上一个年龄段的消息
      if (currentAge !== null && currentMessages.length > 0) {
        ageGroups.push({
          age: currentAge,
          messages: currentMessages.filter(msg => msg.length > 0)
        });
      }
      
      // 开始新的年龄段
      currentAge = parseInt(ageMatch[1]);
      currentMessages = [];
      console.log(`  ✓ 发现年龄段: ${currentAge}岁`);
    } else if (line.length > 0 && currentAge !== null) {
      // 非空行且已经有当前年龄，添加为消息
      currentMessages.push(line);
    }
  }
  
  // 保存最后一个年龄段
  if (currentAge !== null && currentMessages.length > 0) {
    ageGroups.push({
      age: currentAge,
      messages: currentMessages.filter(msg => msg.length > 0)
    });
  }
  
  console.log(`✓ 解析完成: 找到 ${ageGroups.length} 个年龄段`);
  return ageGroups;
}

/**
 * 将消息导入到数据库
 * @param {Array<{age: number, messages: string[]}>} ageGroups
 */
async function importMessages(ageGroups) {
  console.log('\n📥 开始导入消息到数据库...\n');
  
  let totalMessages = 0;
  let successCount = 0;
  let errorCount = 0;
  
  for (const group of ageGroups) {
    const { age, messages } = group;
    
    console.log(`\n📌 导入年龄段: ${age}岁 (${messages.length} 条消息)`);
    
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      totalMessages++;
      
      // 检查消息长度（数据库限制1-500字符）
      if (message.length > 500) {
        console.log(`  ⚠️  消息 ${i + 1} 超过500字符，跳过: ${message.substring(0, 50)}...`);
        errorCount++;
        continue;
      }
      
      // 准备插入数据
      const postData = {
        target_age: age,
        content: message,
        author_age: age, // 设置为同龄人的建议
        user_id: null,   // 匿名消息
        username: null,  // 匿名消息
        like_count: 0,
        view_count: 0,
        is_active: true,
        is_featured: false
      };
      
      // 插入到数据库
      const { data, error } = await supabase
        .from('age_posts')
        .insert(postData)
        .select();
      
      if (error) {
        console.log(`  ❌ 消息 ${i + 1} 导入失败: ${error.message}`);
        console.log(`     内容: ${message.substring(0, 50)}...`);
        errorCount++;
      } else {
        successCount++;
        if ((i + 1) % 10 === 0) {
          console.log(`  ✓ 已导入 ${i + 1}/${messages.length} 条消息`);
        }
      }
      
      // 添加小延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`✓ ${age}岁年龄段导入完成`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 导入统计:');
  console.log(`  总消息数: ${totalMessages}`);
  console.log(`  成功导入: ${successCount}`);
  console.log(`  失败数量: ${errorCount}`);
  console.log('='.repeat(60));
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始导入Markdown消息到数据库\n');
  console.log('='.repeat(60));
  
  // 文件路径
  const file1Path = path.join(__dirname, '../../1.md');
  const file2Path = path.join(__dirname, '../../2.md');
  
  // 检查文件是否存在
  if (!fs.existsSync(file1Path)) {
    console.error(`❌ 文件不存在: ${file1Path}`);
    process.exit(1);
  }
  if (!fs.existsSync(file2Path)) {
    console.error(`❌ 文件不存在: ${file2Path}`);
    process.exit(1);
  }
  
  // 解析文件
  const ageGroups1 = parseMarkdownFile(file1Path);
  const ageGroups2 = parseMarkdownFile(file2Path);
  
  // 合并所有年龄段
  const allAgeGroups = [...ageGroups1, ...ageGroups2];
  
  // 按年龄排序
  allAgeGroups.sort((a, b) => a.age - b.age);
  
  // 显示统计信息
  console.log('\n' + '='.repeat(60));
  console.log('📊 解析统计:');
  console.log(`  年龄范围: ${allAgeGroups[0].age} - ${allAgeGroups[allAgeGroups.length - 1].age}岁`);
  console.log(`  年龄段数: ${allAgeGroups.length}`);
  
  const totalMessages = allAgeGroups.reduce((sum, group) => sum + group.messages.length, 0);
  console.log(`  总消息数: ${totalMessages}`);
  
  // 显示每个年龄段的消息数量
  console.log('\n  各年龄段消息数量:');
  allAgeGroups.forEach(group => {
    console.log(`    ${group.age}岁: ${group.messages.length} 条`);
  });
  console.log('='.repeat(60));
  
  // 确认导入
  console.log('\n⚠️  即将导入 ' + totalMessages + ' 条消息到数据库');
  console.log('   数据库: ' + supabaseUrl);
  console.log('\n按 Ctrl+C 取消，或等待5秒后自动开始...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 执行导入
  await importMessages(allAgeGroups);
  
  console.log('\n✅ 导入完成!\n');
}

// 运行主函数
main().catch(error => {
  console.error('\n❌ 发生错误:', error);
  process.exit(1);
});

