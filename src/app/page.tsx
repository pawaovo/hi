import { AgeGrid } from '@/components/age/age-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-12">
        {/* 头部标题区域 */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-800 mb-6 tracking-tight">
              年龄智慧
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              分享给不同年龄的你的智慧与建议
            </p>
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-slate-300 to-slate-400 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 年龄选择区域 */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-800 mb-4">
              选择一个年龄，开始探索
            </h2>
            <p className="text-slate-600 mb-10">
              每个年龄都有独特的智慧和经验分享
            </p>

            <AgeGrid showAll={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
