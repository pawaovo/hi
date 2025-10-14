/**
 * ��Markdown�ļ�������Ϣ�����ݿ�
 *
 * ʹ�÷���:
 * node scripts/import-messages.js
 */

(async () => {
  const fsModule = await import('node:fs');
  const pathModule = await import('node:path');
  const supabaseModule = await import('@supabase/supabase-js');

  const fs = fsModule.default ?? fsModule;
  const path = pathModule.default ?? pathModule;
  const { createClient } = supabaseModule;

  // ��ȡ.env.local�ļ�
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

  // Supabase����
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('? ����: ȱ��Supabase����');
    console.error('��ȷ��.env.local�ļ��а���:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL');
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  /**
   * ����Markdown�ļ�����ȡ�������Ϣ
   * @param {string} filePath - Markdown�ļ�·��
   * @returns {Array<{age: number, messages: string[]}>}
   */
  function parseMarkdownFile(filePath) {
    console.log(`\n?? ���ڶ�ȡ�ļ�: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const ageGroups = [];
    let currentAge = null;
    let currentMessages = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // ����������: "�٣�XX�����"
      const ageMatch = line.match(/^��[,��]\s*(\d+)\s*�����/);

      if (ageMatch) {
        // ������һ������ε���Ϣ
        if (currentAge !== null && currentMessages.length > 0) {
          ageGroups.push({
            age: currentAge,
            messages: currentMessages.filter(msg => msg.length > 0)
          });
        }

        // ��ʼ�µ������
        currentAge = parseInt(ageMatch[1], 10);
        currentMessages = [];
        console.log(`  ? ���������: ${currentAge}��`);
      } else if (line.length > 0 && currentAge !== null) {
        // �ǿ������Ѿ��е�ǰ���䣬����Ϊ��Ϣ
        currentMessages.push(line);
      }
    }

    // �������һ�������
    if (currentAge !== null && currentMessages.length > 0) {
      ageGroups.push({
        age: currentAge,
        messages: currentMessages.filter(msg => msg.length > 0)
      });
    }

    console.log(`? �������: �ҵ� ${ageGroups.length} �������`);
    return ageGroups;
  }

  /**
   * ����Ϣ���뵽���ݿ�
   * @param {Array<{age: number, messages: string[]}>} ageGroups
   */
  async function importMessages(ageGroups) {
    console.log('\n?? ��ʼ������Ϣ�����ݿ�...\n');

    let totalMessages = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const group of ageGroups) {
      const { age, messages } = group;

      console.log(`\n?? ���������: ${age}�� (${messages.length} ����Ϣ)`);

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        totalMessages++;

        // �����Ϣ���ȣ����ݿ�����1-500�ַ���
        if (message.length > 500) {
          console.log(`  ??  ��Ϣ ${i + 1} ����500�ַ�������: ${message.substring(0, 50)}...`);
          errorCount++;
          continue;
        }

        // ׼����������
        const postData = {
          target_age: age,
          content: message,
          author_age: age, // ����Ϊͬ���˵Ľ���
          user_id: null,   // ������Ϣ
          username: null,  // ������Ϣ
          like_count: 0,
          is_active: true,
          is_featured: false
        };

        // ���뵽���ݿ�
        const { error } = await supabase
          .from('age_posts')
          .insert(postData)
          .select();

        if (error) {
          console.log(`  ? ��Ϣ ${i + 1} ����ʧ��: ${error.message}`);
          console.log(`     ����: ${message.substring(0, 50)}...`);
          errorCount++;
        } else {
          successCount++;
          if ((i + 1) % 10 === 0) {
            console.log(`  ? �ѵ��� ${i + 1}/${messages.length} ����Ϣ`);
          }
        }

        // ����С�ӳ٣������������
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log(`? ${age}������ε������`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('?? ����ͳ��:');
    console.log(`  ����Ϣ��: ${totalMessages}`);
    console.log(`  �ɹ�����: ${successCount}`);
    console.log(`  ʧ������: ${errorCount}`);
    console.log('='.repeat(60));
  }

  /**
   * ������
   */
  async function main() {
    console.log('?? ��ʼ����Markdown��Ϣ�����ݿ�\n');
    console.log('='.repeat(60));

    // �ļ�·��
    const file1Path = path.join(__dirname, '../../1.md');
    const file2Path = path.join(__dirname, '../../2.md');

    // ����ļ��Ƿ����
    if (!fs.existsSync(file1Path)) {
      console.error(`? �ļ�������: ${file1Path}`);
      process.exit(1);
    }
    if (!fs.existsSync(file2Path)) {
      console.error(`? �ļ�������: ${file2Path}`);
      process.exit(1);
    }

    // �����ļ�
    const ageGroups1 = parseMarkdownFile(file1Path);
    const ageGroups2 = parseMarkdownFile(file2Path);

    // �ϲ����������
    const allAgeGroups = [...ageGroups1, ...ageGroups2];

    // ����������
    allAgeGroups.sort((a, b) => a.age - b.age);

    // ��ʾͳ����Ϣ
    console.log('\n' + '='.repeat(60));
    console.log('?? ����ͳ��:');
    console.log(`  ���䷶Χ: ${allAgeGroups[0].age} - ${allAgeGroups[allAgeGroups.length - 1].age}��`);
    console.log(`  �������: ${allAgeGroups.length}`);

    const totalMessages = allAgeGroups.reduce((sum, group) => sum + group.messages.length, 0);
    console.log(`  ����Ϣ��: ${totalMessages}`);

    // ��ʾÿ������ε���Ϣ����
    console.log('\n  ���������Ϣ����:');
    allAgeGroups.forEach(group => {
      console.log(`    ${group.age}��: ${group.messages.length} ��`);
    });
    console.log('='.repeat(60));

    // ȷ�ϵ���
    console.log('\n??  �������� ' + totalMessages + ' ����Ϣ�����ݿ�');
    console.log('   ���ݿ�: ' + supabaseUrl);
    console.log('\n�� Ctrl+C ȡ������ȴ�5����Զ���ʼ...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // ִ�е���
    await importMessages(allAgeGroups);

    console.log('\n? �������!\n');
  }

  // ����������
  main().catch(error => {
    console.error('\n? ��������:', error);
    process.exit(1);
  });
})();
