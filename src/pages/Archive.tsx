import DynastyCarousel from '../components/archive/DynastyCarousel';

const dataCards = [
  { label: 'MODEL ID', value: 'PC_YX_1056' },
  { label: 'DYNASTY', value: 'LIAO (907–1125)' },
  { label: 'LOCATION', value: 'YINGXIAN, CHINA' },
  { label: 'DATE', value: '1056 AD' },
  { label: 'POINTS', value: '134,580,612' },
  { label: 'ACCURACY', value: '0.7 mm' },
];

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="8.5" r="1.5" />
        <circle cx="8.5" cy="15.5" r="1.5" /><circle cx="15.5" cy="15.5" r="1.5" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" opacity="0.3"/>
      </svg>
    ),
    title: '3D 点云档案',
    desc: '高精度扫描数据，每一处结构细节均可交互探索。',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: '互动探索',
    desc: '旋转、缩放、剖切、爆炸——从任意角度审视古塔结构。',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    title: '历史脉络',
    desc: '从辽代始建到千年传承，发现建筑背后的故事。',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '数字保存',
    desc: '以数字化方式为未来世代永久保存这份文化遗产。',
  },
];

const collection = [
  { name: '佛宫寺释迦塔', location: '应县, 中国', year: '1056 AD', img: '/images/pagoda-lineart.jpg' },
  { name: '应县木塔', location: '应县, 中国', year: '1056 AD', img: '/images/pagoda-blueprint.jpg' },
  { name: '赵州桥', location: '赵县, 中国', year: '605 AD', img: '/images/pagoda-lineart.jpg' },
];

export default function Archive() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E4DC] relative overflow-hidden">
      {/* 背景网格 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,78,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,78,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ───── Hero 区域 ───── */}
      <div className="relative max-w-[1440px] mx-auto px-8 lg:px-16 pt-28 pb-12">
        <div className="flex gap-10 lg:gap-16 items-start min-h-[72vh]">

          {/* 左栏：标题区 */}
          <div className="flex-shrink-0 w-full lg:w-[340px] pt-8 lg:pt-16 space-y-8">
            {/* 标签 */}
            <p className="text-[11px] font-mono tracking-[0.35em] text-gold-500/70 uppercase">
              Digital Heritage Archive
            </p>

            {/* 大标题 */}
            <h1 className="font-serif text-5xl xl:text-6xl leading-tight tracking-wide text-white/95">
              PAGODA<br />CLOUD ATLAS
            </h1>

            {/* 副标题 */}
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              应县木塔数字档案。通过点云技术，以毫米级精度记录千年木构建筑的结构细节。
            </p>

            {/* 探索按钮 */}
            <button
              onClick={() => window.location.href = '/pointcloud'}
              className="group flex items-center gap-3 px-6 py-3 border border-gold-500/30 rounded-sm
                hover:border-gold-500 hover:bg-gold-500/5 transition-all duration-300"
            >
              <span className="w-8 h-8 flex items-center justify-center rounded-full border border-gold-500/40 group-hover:bg-gold-500 group-hover:text-black transition-all">
                <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current ml-0.5"><polygon points="4,2 14,8 4,14"/></svg>
              </span>
              <span className="text-[13px] font-mono tracking-widest text-gold-400 group-hover:text-gold-300 uppercase">探索点云</span>
            </button>

            {/* 缩略图条 */}
            <div className="pt-4 grid grid-cols-3 gap-2.5 max-w-[240px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`aspect-square rounded-sm overflow-hidden cursor-pointer
                  border ${i === 1 ? 'border-gold-500/50 ring-1 ring-gold-500/20' : 'border-white/[0.06] hover:border-white/20'} transition-all`}>
                  <img
                    src={i === 1 ? '/images/pagoda-lineart.jpg' : '/images/pagoda-blueprint.jpg'}
                    alt=""
                    className="w-full h-full object-cover opacity-60 hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 中间：主视觉（线稿大图） */}
          <div className="flex-1 flex items-center justify-center py-8 relative">
            {/* 装饰圆环 */}
            <div className="absolute w-[520px] h-[520px] rounded-full border border-gold-500/[0.04]" />
            <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan/[0.02]" />

            <div className="relative z-10 max-w-[480px] w-full">
              <img
                src="/images/pagoda-lineart.jpg"
                alt="应县木塔线稿"
                className="w-full h-auto drop-shadow-[0_30px_80px_rgba(201,168,78,0.08)]"
                style={{ filter: 'brightness(0.85) contrast(1.05)' }}
              />
              {/* 底部标注 */}
              <div className="flex items-center justify-between mt-4 px-2">
                <span className="text-[10px] text-white/25 font-mono tracking-widest uppercase">立面 · 线稿</span>
                <span className="text-[10px] text-white/20 font-mono">应县木塔 · 辽清宁二年</span>
              </div>
            </div>
          </div>

          {/* 右栏：数据卡片 */}
          <div className="hidden xl:flex flex-col justify-end pt-16 pb-4 gap-2.5 w-[200px] shrink-0">
            {dataCards.map((d) => (
              <div key={d.label} className="glass-panel px-4 py-2.5">
                <p className="text-[9px] font-mono tracking-[0.25em] text-white/25 uppercase mb-1">{d.label}</p>
                <p className="text-[13px] font-mono tabular-nums text-white/65">{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部滚动提示 */}
        <div className="flex items-center justify-center gap-2 mt-8 pb-8">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[9px] font-mono tracking-[0.35em] text-white/20 uppercase">向下浏览</span>
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500/30 animate-pulse" />
        </div>
      </div>

      {/* ───── 功能卡片 ───── */}
      <section className="max-w-[1200px] mx-auto px-8 lg:px-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass-panel p-7 hover:border-gold-500/20 group transition-colors duration-300 cursor-default">
              <div className="text-gold-500/50 group-hover:text-gold-500 transition-colors mb-4">{f.icon}</div>
              <h3 className="font-serif text-base text-white/85 tracking-wide mb-2">{f.title}</h3>
              <p className="text-[12px] text-white/30 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Collection 探索区 ───── */}
      <section className="max-w-[1200px] mx-auto px-8 lg:px-16 pb-28">
        <div className="flex items-start gap-12">
          {/* 左侧标题 */}
          <div className="w-[280px] shrink-0 hidden md:block pt-4">
            <h2 className="font-serif text-2xl text-white/90 tracking-wider leading-snug mb-4">
              Explore the Collection
            </h2>
            <div className="h-px w-12 bg-gold-500/30 mb-6" />
            <p className="text-[13px] text-white/30 leading-relaxed">
              浏览中国现存古塔的数字化档案集合，每座建筑都经过高精度扫描记录。
            </p>
            <button className="mt-6 inline-flex items-center gap-2 text-[12px] font-mono tracking-wider text-gold-400/70 hover:text-gold-300 transition-colors">
              VIEW COLLECTION
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">→</span>
            </button>
          </div>

          {/* 右侧收藏列表 */}
          <div className="flex-1 space-y-3">
            {collection.map((item, i) => (
              <div key={i} className="flex items-center gap-5 glass-panel p-3 hover:border-white/10 transition-colors group cursor-pointer">
                <div className="w-16 h-20 shrink-0 rounded-sm overflow-hidden bg-white/[0.02] border border-white/[0.05]">
                  <img src={item.img} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" style={{ filter: 'grayscale(100%) brightness(0.7)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-medium text-white/60 tracking-wide truncate group-hover:text-white/80 transition-colors">
                    {item.name.toUpperCase()}
                  </h4>
                  <p className="text-[11px] text-white/25 font-mono mt-1">{item.location} · {item.year}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <button className="text-[11px] font-mono tracking-widest text-white/20 hover:text-white/40 transition-colors flex items-center gap-2">
                VIEW ALL <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── 朝代时间轴（保留）─── */}
      <div className="bg-paper/98 -mx-4 px-8 lg:px-16 py-20 border-t border-stamp/5">
        <div className="max-w-[900px] mx-auto">
          <DynastyCarousel />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-[10px] text-white/[0.12] font-mono tracking-wider">
          © 2026 Pagoda Cloud Atlas — 塔影云图
        </p>
      </footer>
    </div>
  );
}
