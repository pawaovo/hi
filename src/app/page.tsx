import { AgeGrid } from '@/components/age/age-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-12">
        {/* 头部标题区域 */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-600 mb-6 tracking-tight">
              Hi
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              按7年1辈子来算,一生大概有十来个辈子,你在人生进度条的哪个位置呢？<br />
              也许很幸福,也可能遇到一些麻烦和问题。<br />
              在这里你可以进入不同的时间线,听听回响或者留下痕迹。<br />
              希望这些保留下来的文字,常有陪伴和力量。
            </p>
            <div className="mt-8 w-72 h-1 bg-gradient-to-r from-slate-300 to-slate-400 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 年龄选择区域 */}
          <div className="mb-12">
            <AgeGrid showAll={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
