// 部署前连通性自检脚本
// 用法: node scripts/verify-connection.mjs
// 作用: 模拟前端真实请求路径，验证 Supabase 数据层是否可用

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const env = readFileSync(join(root, '.env.local'), 'utf8')
const get = (k) => {
  const line = env.split('\n').find((l) => l.startsWith(k + '='))
  return line ? line.slice(k.length + 1).trim() : ''
}

const SUPA = get('NEXT_PUBLIC_SUPABASE_URL')
const KEY = get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if (!SUPA || !KEY) {
  console.error('缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY }

async function test(name, fn) {
  try {
    const detail = await fn()
    console.log('  [OK]   ' + name + ' -> ' + detail)
    return true
  } catch (e) {
    console.log('  [FAIL] ' + name + ' -> ' + e.message)
    return false
  }
}

console.log('Supabase: ' + SUPA)
console.log('模拟前端真实请求路径\n')

let pass = 0
let total = 0

async function run(name, fn) {
  total++
  if (await test(name, fn)) pass++
}

await run('age_posts 可读取', async () => {
  const r = await fetch(SUPA + '/rest/v1/age_posts?select=id&limit=1', { headers })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return '正常'
})

await run('getAgeStats 统计查询', async () => {
  const r = await fetch(SUPA + '/rest/v1/age_posts?select=target_age&is_active=eq.true', { headers })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const data = await r.json()
  const ages = new Set(data.map((p) => p.target_age))
  return data.length + ' 条记录，覆盖 ' + ages.size + ' 个年龄段'
})

await run('getPostsByAge 分页查询', async () => {
  const url =
    SUPA +
    '/rest/v1/age_posts?select=*&target_age=eq.18&is_active=eq.true' +
    '&order=like_count.desc,created_at.desc&limit=20'
  const r = await fetch(url, { headers })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const d = await r.json()
  return d.length + ' 条 18 岁留言'
})

await run('users 表可读取', async () => {
  const r = await fetch(SUPA + '/rest/v1/users?select=id&limit=1', {
    headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const n = (r.headers.get('content-range') || '').split('/')[1]
  return n + ' 个用户'
})

await run('post_likes 表可读取', async () => {
  const r = await fetch(SUPA + '/rest/v1/post_likes?select=id&limit=1', {
    headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const n = (r.headers.get('content-range') || '').split('/')[1]
  return n + ' 条点赞'
})

await run('getSiteStats 汇总查询', async () => {
  const [posts, users, likes] = await Promise.all([
    fetch(SUPA + '/rest/v1/age_posts?select=id', {
      headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
    }),
    fetch(SUPA + '/rest/v1/users?select=id', {
      headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
    }),
    fetch(SUPA + '/rest/v1/age_posts?select=like_count', { headers }),
  ])
  const likeTotal = (await likes.json()).reduce((s, x) => s + (x.like_count || 0), 0)
  const pn = (posts.headers.get('content-range') || '').split('/')[1]
  const un = (users.headers.get('content-range') || '').split('/')[1]
  return pn + ' 条留言 / ' + un + ' 用户 / ' + likeTotal + ' 点赞'
})

await run('写入权限检查 (匿名发布完整路径)', async () => {
  const r = await fetch(SUPA + '/rest/v1/age_posts', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({
      target_age: 7,
      content: '__connectivity_probe__',
      author_age: 7,
      like_count: 0,
      is_active: true,
    }),
  })
  if (!r.ok) {
    const t = await r.text()
    throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 120))
  }
  const created = await r.json()
  const id = created[0]?.id
  // 立即清理探针数据，避免污染线上内容
  if (id) {
    await fetch(SUPA + '/rest/v1/age_posts?id=eq.' + id, { method: 'DELETE', headers })
  }
  return '可写入，探针数据已自动回滚'
})

console.log('\n结果: ' + pass + '/' + total + ' 项通过')
process.exit(pass === total ? 0 : 1)
