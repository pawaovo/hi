// =====================================================
// 《人生七年》(The Up Series) 专题页数据
// =====================================================
// 说明：
// 内容力求精简，每人控制在 2-3 句。转折点标记只依据
// 当事人在片中明确表达过的感受，不做额外价值判断。

// ---------- 系列作品 ----------

export interface UpEpisode {
  age: number
  year: number
  title: string
  note?: string
}

export const UP_EPISODES: UpEpisode[] = [
  { age: 7, year: 1964, title: 'Seven Up!', note: '原为格拉纳达电视台时事节目的一集' },
  { age: 14, year: 1970, title: '7 Plus Seven' },
  { age: 21, year: 1977, title: '21 Up' },
  { age: 28, year: 1984, title: '28 Up' },
  { age: 35, year: 1991, title: '35 Up' },
  { age: 42, year: 1998, title: '42 Up' },
  { age: 49, year: 2005, title: '49 Up' },
  { age: 56, year: 2012, title: '56 Up' },
  { age: 63, year: 2019, title: '63 Up' },
  { age: 70, year: 2026, title: '70 Up', note: '2026 年 9 月 15 日首播，系列收官之作' },
]

export const UP_AGES = UP_EPISODES.map((e) => e.age)

// ---------- 分组 ----------

export type GroupId = 'kensington' | 'suzy' | 'boarding' | 'eastend' | 'care'

export interface UpGroup {
  id: GroupId
  label: string
  desc: string
}

export const UP_GROUPS: UpGroup[] = [
  { id: 'kensington', label: '肯辛顿三人组', desc: '伦敦富裕区，私立预备学校' },
  { id: 'suzy', label: '富家女', desc: '萨里郡乡间，家境优渥' },
  { id: 'boarding', label: '寄宿学校', desc: '利物浦与伦敦，中产与乡村中产' },
  { id: 'eastend', label: '东伦敦', desc: '伦敦东区，工人阶级' },
  { id: 'care', label: '儿童之家 · 利物浦', desc: '福利机构与利物浦郊区' },
]

// ---------- 转折点 ----------

export type MarkKind = 'rise' | 'fall' | 'turn'

export const MARK_LABEL: Record<MarkKind, string> = {
  rise: '向好',
  fall: '受挫',
  turn: '转变',
}

export interface UpMark {
  age: number
  kind: MarkKind
}

export interface UpAgeStage {
  /** 对应年龄 */
  age: number
  /** 该年龄段的一句话状态 */
  stage: string
  /** 该年龄段的简短说明，人物志里用 */
  detail: string
}

// ---------- 参与者 ----------

export interface UpPerson {
  id: string
  name: string
  group: GroupId
  /** 出身一句话 */
  origin: string
  /** 一句话人设 */
  tagline: string
  /** 已离世则标注年份 */
  deceased?: string
  /** 各年龄段状态 */
  stages: UpAgeStage[]
  marks: UpMark[]
}

export const UP_PEOPLE: UpPerson[] = [
  // ---------- 肯辛顿三人组 ----------
  {
    id: 'john',
    name: 'John',
    group: 'kensington',
    origin: '伦敦肯辛顿 · 富裕家庭',
    tagline: '7 岁读《金融时报》的那个孩子，后来做慈善',
    stages: [
      { age: 7, stage: '读《金融时报》', detail: '已在阅读《金融时报》，说长大要当律师。' },
      { age: 14, stage: '公学', detail: '进入知名公学，谈论政治与理想。' },
      { age: 21, stage: '牛津', detail: '进入牛津大学，目标明确。' },
      { age: 28, stage: '律师', detail: '成为诉讼律师，path 与 7 岁设想一致。' },
      { age: 35, stage: '成家', detail: '结婚，事业进入上升期。' },
      { age: 42, stage: '合伙人', detail: '在律所升任合伙人。' },
      { age: 49, stage: '慈善', detail: '家族与保加利亚有渊源，投入慈善事业。' },
      { age: 56, stage: '乡居', detail: '重心转向家庭与公益。' },
      { age: 63, stage: '退休', detail: '淡出执业，回顾一生时提到童年丧父的影响。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 21, kind: 'rise' }, { age: 42, kind: 'rise' }, { age: 49, kind: 'turn' }],
  },
  {
    id: 'andrew',
    name: 'Andrew',
    group: 'kensington',
    origin: '伦敦肯辛顿 · 富裕家庭',
    tagline: '路线最平稳的一个，很少抱怨',
    stages: [
      { age: 7, stage: '读报', detail: '与 John 一同就读私立预备学校。' },
      { age: 14, stage: '公学', detail: '按部就班升学。' },
      { age: 21, stage: '牛津', detail: '进入牛津大学读法律。' },
      { age: 28, stage: '律师', detail: '进入律所执业。' },
      { age: 35, stage: '成家', detail: '结婚生子，生活稳定。' },
      { age: 42, stage: '合伙人', detail: '在律所升任合伙人。' },
      { age: 49, stage: '搬离', detail: '因工作移居美国。' },
      { age: 56, stage: '回国', detail: '回到英国，参加社区活动。' },
      { age: 63, stage: '退休', detail: '退休，谈吐一如既往温和。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 21, kind: 'rise' }, { age: 42, kind: 'rise' }, { age: 49, kind: 'turn' }],
  },
  {
    id: 'charles',
    name: 'Charles',
    group: 'kensington',
    origin: '伦敦肯辛顿 · 富裕家庭',
    tagline: '最早退出拍摄的人，后来做了纪录片',
    stages: [
      { age: 7, stage: '读报', detail: '与 John、Andrew 同为肯辛顿三人组。' },
      { age: 14, stage: '公学', detail: '在镜头前谈到对未来的想法。' },
      { age: 21, stage: '退出', detail: '21 岁后退出拍摄，此后不再出现。' },
      { age: 28, stage: '——', detail: '未参与。' },
      { age: 35, stage: '——', detail: '未参与。' },
      { age: 42, stage: '——', detail: '未参与。' },
      { age: 49, stage: '——', detail: '未参与。' },
      { age: 56, stage: '——', detail: '未参与。' },
      { age: 63, stage: '——', detail: '未参与。' },
      { age: 70, stage: '——', detail: '未参与。' },
    ],
    marks: [{ age: 21, kind: 'turn' }],
  },

  // ---------- 富家女 ----------
  {
    id: 'suzy',
    name: 'Suzy',
    group: 'suzy',
    origin: '萨里郡 · 乡间富裕家庭',
    tagline: '从叛逆少女到安静的乡间母亲',
    stages: [
      { age: 7, stage: '乡间', detail: '在萨里郡长大，家境优渥。' },
      { age: 14, stage: '叛逆', detail: '对拍摄明显抗拒，镜头前很冷淡。' },
      { age: 21, stage: '离开', detail: '一度离开英国，谈到父母离异对自己的影响。' },
      { age: 28, stage: '成家', detail: '结婚后生活安定下来，状态大幅改变。' },
      { age: 35, stage: '育儿', detail: '专心养育子女，定居乡间。' },
      { age: 42, stage: '平静', detail: '在片中显得从容，谈及婚姻带来的稳定。' },
      { age: 49, stage: '乡居', detail: '生活重心在家庭与住所。' },
      { age: 56, stage: '丧偶', detail: '丈夫病逝，独自面对生活。' },
      { age: 63, stage: '重建', detail: '再度安定，参与社区与教会活动。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 21, kind: 'fall' }, { age: 28, kind: 'rise' }, { age: 56, kind: 'fall' }, { age: 63, kind: 'rise' }],
  },

  // ---------- 寄宿学校 ----------
  {
    id: 'bruce',
    name: 'Bruce',
    group: 'boarding',
    origin: '伦敦 · 中产家庭',
    tagline: '7 岁说要去非洲教穷人的孩子，他真的去了',
    stages: [
      { age: 7, stage: '想当传教士', detail: '在寄宿学校，说长大要去非洲教穷苦孩子。' },
      { age: 14, stage: '寄宿', detail: '继续寄宿学校生活，性格温和。' },
      { age: 21, stage: '牛津', detail: '进入牛津大学读数学。' },
      { age: 28, stage: '教师', detail: '在东伦敦一所学校教书，与预期不同但仍在教育行业。' },
      { age: 35, stage: '孟加拉', detail: '前往孟加拉国教书，兑现了 7 岁的话。' },
      { age: 42, stage: '回英', detail: '回到英国，继续在公立学校任教。' },
      { age: 49, stage: '成家', detail: '结婚，生活朴素。' },
      { age: 56, stage: '副校长', detail: '在城市学校担任管理职务。' },
      { age: 63, stage: '退休', detail: '退休，仍参与教会与公益。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 35, kind: 'turn' }, { age: 49, kind: 'rise' }, { age: 63, kind: 'rise' }],
  },
  {
    id: 'peter',
    name: 'Peter',
    group: 'boarding',
    origin: '利物浦 · 中产家庭',
    tagline: '中途退出二十年，56 岁又回来了',
    stages: [
      { age: 7, stage: '寄宿', detail: '在寄宿学校读书，喜欢音乐。' },
      { age: 14, stage: '乐队', detail: '与同学组乐队，谈音乐与政治。' },
      { age: 21, stage: '大学', detail: '进入大学，对时事态度直接。' },
      { age: 28, stage: '退出', detail: '28 岁后退出拍摄，此后长期缺席。' },
      { age: 35, stage: '——', detail: '未参与。' },
      { age: 42, stage: '——', detail: '未参与。' },
      { age: 49, stage: '——', detail: '未参与。' },
      { age: 56, stage: '回归', detail: '时隔近三十年后重新参与，已是公务员，仍在玩音乐。' },
      { age: 63, stage: '乐队', detail: '与老友重组乐队并演出。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 28, kind: 'turn' }, { age: 56, kind: 'rise' }],
  },
  {
    id: 'neil',
    name: 'Neil',
    group: 'boarding',
    origin: '利物浦郊区 · 教师家庭',
    tagline: '从无家可归到成为牧师，全片最戏剧性的一条线',
    stages: [
      { age: 7, stage: '活泼', detail: '在利物浦郊区长大，活泼爱笑。' },
      { age: 14, stage: '沉默', detail: '变得内向，谈起未来时明显不安。' },
      { age: 21, stage: '辍学', detail: '从大学退学，在工地做工，说自己看不到希望。' },
      { age: 28, stage: '流浪', detail: '离开英国，在苏格兰一带漂泊，居无定所。' },
      { age: 35, stage: '流浪', detail: '仍四处流动，靠临时工作维生。' },
      { age: 42, stage: '无家可归', detail: '住在伦敦一处临时住所，公开谈起自己的抑郁。' },
      { age: 49, stage: '定居', detail: '在苏格兰一座小岛落脚，开始参与社区事务。' },
      { age: 56, stage: '从政受挫', detail: '参选地方议员落败，回到教会工作。' },
      { age: 63, stage: '牧师', detail: '被按立为牧师，说终于找到了归宿。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 21, kind: 'fall' }, { age: 42, kind: 'fall' }, { age: 63, kind: 'rise' }],
  },

  // ---------- 东伦敦 ----------
  {
    id: 'tony',
    name: 'Tony',
    group: 'eastend',
    origin: '伦敦东区 · 工人阶级',
    tagline: '想当骑师的小孩，开了一辈子出租车',
    stages: [
      { age: 7, stage: '想当骑师', detail: '在伦敦东区长大，说想当赛马骑师。' },
      { age: 14, stage: '赛马', detail: '真的进了赛马场当学徒。' },
      { age: 21, stage: '转行', detail: '骑师路走不通，转做出租车司机。' },
      { age: 28, stage: '开车', detail: '开出租车，成家。' },
      { age: 35, stage: '置业', detail: '在伦敦东区买房，生活改善。' },
      { age: 42, stage: '副业', detail: '还在开出租，同时尝试别的生意。' },
      { age: 49, stage: '儿女', detail: '孩子长大，谈到家庭时很骄傲。' },
      { age: 56, stage: '波折', detail: '婚外情被曝光，婚姻出现危机。' },
      { age: 63, stage: '和解', detail: '与妻子修好关系，仍在开出租。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 21, kind: 'turn' }, { age: 35, kind: 'rise' }, { age: 56, kind: 'fall' }, { age: 63, kind: 'rise' }],
  },
  {
    id: 'jackie',
    name: 'Jackie',
    group: 'eastend',
    origin: '伦敦东区 · 工人阶级',
    tagline: '三个东区女孩之一，人生最多波折',
    stages: [
      { age: 7, stage: '东区', detail: '与 Lynn、Sue 一起在东伦敦上学。' },
      { age: 14, stage: '上学', detail: '三人同校，谈各自的理想。' },
      { age: 21, stage: '成家', detail: '较早结婚，开始家庭生活。' },
      { age: 28, stage: '离婚', detail: '婚姻破裂，独自带孩子。' },
      { age: 35, stage: '再婚', detail: '再婚，生活一度稳定。' },
      { age: 42, stage: '离婚', detail: '再次离婚，独自抚养孩子。' },
      { age: 49, stage: '病痛', detail: '健康出现问题，靠救济金生活。' },
      { age: 56, stage: '艰难', detail: '经济拮据，谈起生活时不易。' },
      { age: 63, stage: '儿孙', detail: '靠子女与孙辈支撑，态度仍然直率。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 28, kind: 'fall' }, { age: 42, kind: 'fall' }, { age: 49, kind: 'fall' }],
  },
  {
    id: 'lynn',
    name: 'Lynn',
    group: 'eastend',
    origin: '伦敦东区 · 工人阶级',
    tagline: '一辈子做儿童图书馆员，2013 年离世',
    deceased: '2013 年去世',
    stages: [
      { age: 7, stage: '东区', detail: '与 Jackie、Sue 一起在东伦敦上学。' },
      { age: 14, stage: '上学', detail: '谈到想从事与孩子相关的工作。' },
      { age: 21, stage: '成家', detail: '结婚，进入图书馆工作。' },
      { age: 28, stage: '图书馆', detail: '在儿童图书馆工作，同时养育子女。' },
      { age: 35, stage: '教书', detail: '参与特殊教育相关工作。' },
      { age: 42, stage: '坚持', detail: '公共图书馆经费被削减，她公开表达不满。' },
      { age: 49, stage: '病痛', detail: '健康开始出问题。' },
      { age: 56, stage: '离世', detail: '2013 年去世，未及参与后续拍摄。' },
      { age: 63, stage: '缺席', detail: '已离世。' },
      { age: 70, stage: '缺席', detail: '已离世。' },
    ],
    marks: [{ age: 56, kind: 'fall' }],
  },
  {
    id: 'sue',
    name: 'Sue',
    group: 'eastend',
    origin: '伦敦东区 · 工人阶级',
    tagline: '离婚后重新起步，越活越开阔',
    stages: [
      { age: 7, stage: '东区', detail: '与 Jackie、Lynn 一起在东伦敦上学。' },
      { age: 14, stage: '上学', detail: '三人同校，性格开朗。' },
      { age: 21, stage: '成家', detail: '结婚，做文职工作。' },
      { age: 28, stage: '离婚', detail: '离婚，独自抚养两个孩子。' },
      { age: 35, stage: '打拼', detail: '一边工作一边带孩子，生活紧张。' },
      { age: 42, stage: '新伴侣', detail: '有了稳定的伴侣，状态好转。' },
      { age: 49, stage: '升职', detail: '在一所大学做行政工作，获得晋升。' },
      { age: 56, stage: '从容', detail: '对未来有规划，谈到退休生活。' },
      { age: 63, stage: '安定', detail: '生活安稳，是三人中境况最好的。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 28, kind: 'fall' }, { age: 42, kind: 'rise' }, { age: 49, kind: 'rise' }],
  },

  // ---------- 儿童之家 · 利物浦 ----------
  {
    id: 'paul',
    name: 'Paul',
    group: 'care',
    origin: '伦敦儿童之家 → 澳大利亚',
    tagline: '在福利院长大，后来在澳洲安了家',
    stages: [
      { age: 7, stage: '儿童之家', detail: '住在伦敦一家儿童福利机构，对未来没什么概念。' },
      { age: 14, stage: '移民', detail: '随家人移居澳大利亚。' },
      { age: 21, stage: '打工', detail: '在澳洲做建筑相关工作。' },
      { age: 28, stage: '成家', detail: '结婚，生活稳定下来。' },
      { age: 35, stage: '建屋', detail: '自己动手盖房子，谈到家庭时很满足。' },
      { age: 42, stage: '平淡', detail: '生活平稳，性格依旧内敛。' },
      { age: 49, stage: '育儿', detail: '孩子长大，谈及童年时仍有情绪。' },
      { age: 56, stage: '安稳', detail: '生活如常，与妻子互相扶持。' },
      { age: 63, stage: '回顾', detail: '回看童年经历对自己的影响。' },
      { age: 70, stage: '——', detail: '出场，具体状况待补充。' },
    ],
    marks: [{ age: 28, kind: 'rise' }, { age: 35, kind: 'rise' }],
  },
  {
    id: 'nick',
    name: 'Nick',
    group: 'care',
    origin: '约克郡乡村 · 农场家庭',
    tagline: '从乡村男孩到美国大学教授，2024 年离世',
    deceased: '2024 年去世',
    stages: [
      { age: 7, stage: '农场', detail: '在约克郡乡下长大，就读只有一间教室的村小。' },
      { age: 14, stage: '寄宿', detail: '进入寄宿学校，显得不太适应。' },
      { age: 21, stage: '牛津', detail: '考入牛津大学读物理。' },
      { age: 28, stage: '赴美', detail: '到美国攻读博士，研究方向为核物理。' },
      { age: 35, stage: '任教', detail: '在美国一所大学任教。' },
      { age: 42, stage: '教授', detail: '成为教授，出版学术著作。' },
      { age: 49, stage: '学术', detail: '专注研究与教学，是片中阶级流动最明显的一例。' },
      { age: 56, stage: '写作', detail: '开始写面向公众的书，谈科学与教育。' },
      { age: 63, stage: '病中', detail: '公开谈到自己的健康问题。' },
      { age: 70, stage: '缺席', detail: '2024 年因脑瘤去世。' },
    ],
    marks: [{ age: 21, kind: 'rise' }, { age: 42, kind: 'rise' }, { age: 63, kind: 'fall' }],
  },
]

// ---------- 主题观察 ----------

export interface UpTheme {
  title: string
  people: string
  text: string
}

export const UP_THEMES: UpTheme[] = [
  {
    title: '阶级与流动',
    people: 'Nick · Tony · John',
    text: '片中大多数人的路径与出身高度相关。Nick 是少数打破轨道的人，靠教育从村小走到大学教授。但导演并未把它讲成励志故事——Nick 也在片中说过，他始终觉得自己不完全属于任何一边。',
  },
  {
    title: '婚姻与家庭',
    people: 'Suzy · Sue · Jackie · Tony',
    text: '婚姻状况几乎决定了多数人在中年的状态。Suzy 因婚姻而稳定，Sue 在离婚后反而越走越开阔，Jackie 则在两次离婚后陷入困顿。同样的变故，走出的方向并不相同。',
  },
  {
    title: '健康与衰老',
    people: 'Lynn · Nick · Neil',
    text: '到了 56 岁之后，镜头开始记录病痛与死亡。Lynn 在 2013 年去世，Nick 于 2024 年因脑瘤离世。衰老在这部片子里没有修饰，它就是继续拍下去必然会遇到的东西。',
  },
  {
    title: '梦想与妥协',
    people: 'Bruce · Tony · Neil',
    text: '7 岁时的愿望，有的真的实现了，有的换了形状。Bruce 说要去非洲教书，他去了；Tony 想当骑师，没当成，但他说自己后来过得并不差；Neil 曾看不到任何希望，却在 63 岁成为牧师。',
  },
]

// ---------- 争议与反思 ----------

export interface UpCritique {
  title: string
  text: string
}

export const UP_CRITIQUES: UpCritique[] = [
  {
    title: '样本太小',
    text: '14 个人无法代表英国社会。片中呈现的「阶级复制」更像是一个刻意挑选的对照组，而不是统计意义上的结论。',
  },
  {
    title: '提问带导向',
    text: '导演 Michael Apted 长期担任提问者，问题本身会影响回答。多年拍摄后，一些参与者明显对镜头感到疲惫，回答也变得简短。',
  },
  {
    title: '决定论倾向',
    text: '因为每个人的出身在 7 岁就交代清楚了，「出身决定一生」的观感被结构性放大，容易忽略偶然、运气与个人选择。',
  },
  {
    title: '被拍摄的人生',
    text: '参与者在几十年里反复被问同样的问题。有人退出，有人回归。这本身提醒我们：纪录片记录的既是他们的人生，也是被镜头塑造的人生。',
  },
]

// ---------- 系列简介 ----------

export const UP_INTRO = {
  lead: '1964 年，英国格拉纳达电视台找来了 14 个 7 岁的孩子。',
  body: [
    '他们来自完全不同的家庭：有肯辛顿的富家子弟，有伦敦东区的工人子弟，有福利院的孩子，也有约克郡乡下的农场男孩。导演问他们同一个问题——你长大想做什么？',
    '此后每七年，镜头就回到他们面前一次。从 7 岁到 70 岁，整整拍了六十二年。',
  ],
  crew: '原版由 Paul Almond 执导，Michael Apted 自 7 Up 起参与研究、从 14 Up 起全程担任导演，直到 2021 年去世。70 Up 于 2026 年 9 月 15 日首播，是系列的收官之作。',
}

// ---------- 导航 ----------

export const UP_NAV = [
  { id: 'intro', label: '系列简介' },
  { id: 'matrix', label: '时间轴矩阵' },
  { id: 'people', label: '人物索引' },
  { id: 'themes', label: '主题观察' },
  { id: 'critique', label: '争议与反思' },
]
