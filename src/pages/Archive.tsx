import DynastyCarousel from '../components/archive/DynastyCarousel';

const pagodaData = {
  name: '应县木塔',
  nameEn: 'Yingxian Wooden Pagoda',
  aka: '佛宫寺释迦塔',
  dynasty: '辽 · 清宁二年',
  year: '1056',
  location: '山西省朔州市应县',
  height: '67.31m',
  floors: '9 层（5明4暗）',
  material: '纯木 · 榫卯无钉',
  status: '现存最高木构建筑',
  description: `应县木塔，全称佛宫寺释迦塔，位于山西省朔州市应县城内西北佛宫寺内。建于辽清宁二年（公元1056年），金明昌六年（公元1195年）增修完毕，是世界上现存最高大、最古老的纯木结构楼阁式建筑。全塔耗材红松木料三千立方米，重约两千六百吨，纯木结构、无钉无铆。塔内供奉着两颗释迦牟尼佛牙舍利。`,
  dimensions: [
    { label: '总高', value: '67.31 m' },
    { label: '底层直径', value: '30.27 m' },
    { label: '顶层直径', value: '19.74 m' },
    { label: '塔刹高', value: '10 m' },
  ],
  stats: [
    { label: '层数', value: '9', unit: '层', sub: '5明层 + 4暗层' },
    { label: '斗栱', value: '54', unit: '种', sub: '形态各异' },
    { label: '立柱', value: '312', unit: '根', sub: '承重结构' },
    { label: '年代', value: '969', unit: '年', sub: '辽清宁二年至今' },
  ],
};

export default function Archive() {
  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      {/* 背景水墨山峦 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,650 Q200,500 400,580 Q600,660 800,520 Q1000,380 1200,480 Q1350,550 1440,500 L1440,900 L0,900Z" fill="#2C2416" />
          <path d="M0,700 Q300,560 550,640 Q800,720 1050,590 Q1250,500 1440,570 L1440,900 L0,900Z" fill="#2C2416" opacity="0.6" />
          <path d="M0,750 Q250,650 500,700 Q750,750 1000,660 Q1250,600 1440,670 L1440,900 L0,900Z" fill="#2C2416" opacity="0.3" />
        </svg>
      </div>

      {/* Top decoration: subtle red line */}
      <div className="relative w-full h-px bg-gradient-to-r from-transparent via-stamp/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-8 pt-24 pb-16">
        {/* ───── Hero Section ───── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 mb-20">
          {/* 左侧：塔形插画 */}
          <div className="flex-shrink-0 relative">
            {/* 高度标尺 */}
            <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between py-2">
              <span className="text-[10px] text-ink-500/40 font-mono">67m</span>
              <span className="text-[10px] text-ink-500/40 font-mono">50m</span>
              <span className="text-[10px] text-ink-500/40 font-mono">30m</span>
              <span className="text-[10px] text-ink-500/40 font-mono">10m</span>
              <span className="text-[10px] text-ink-500/40 font-mono">0m</span>
            </div>
            {/* 高度标尺线 */}
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-ink-900/8" />

            <TowerIllustration />
          </div>

          {/* 右侧：标题 + 核心信息 */}
          <div className="flex-1 pt-6">
            {/* 红色印章装饰 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 w-12 h-12 border-2 border-stamp rounded-sm flex items-center justify-center rotate-6">
                <span className="font-kaiti text-stamp text-[11px] leading-tight text-center">释迦<br />宝塔</span>
              </div>
              <div>
                <h1 className="font-serif text-5xl lg:text-6xl text-ink-900 tracking-widest leading-tight">
                  {pagodaData.name}
                </h1>
                <p className="text-sm text-ink-500/60 font-mono tracking-[0.3em] mt-2">
                  {pagodaData.nameEn}
                </p>
              </div>
            </div>

            {/* 关键数据卡片 */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pagodaData.stats.map((s) => (
                <div key={s.label} className="glass-panel-light p-4 text-center group hover:border-stamp/20 transition-colors">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-serif text-ink-900">{s.value}</span>
                    <span className="text-xs text-ink-500/60">{s.unit}</span>
                  </div>
                  <p className="text-[11px] text-ink-600/80 font-medium mt-1">{s.label}</p>
                  <p className="text-[10px] text-ink-500/40 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* 一句话简介 */}
            <div className="mt-8 flex items-start gap-3">
              <div className="w-0.5 h-full min-h-[3em] bg-stamp/30 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-ink-500/60 tracking-widest uppercase mb-2">Introduction</p>
                <p className="text-sm text-ink-700 leading-relaxed max-w-lg">
                  {pagodaData.description}
                </p>
              </div>
            </div>

            {/* 标签行 */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[11px] px-2.5 py-1 bg-stamp/5 text-stamp border border-stamp/15 rounded-sm font-medium">
                {pagodaData.dynasty}
              </span>
              <span className="text-[11px] px-2.5 py-1 bg-ink-900/5 text-ink-600 border border-ink-900/8 rounded-sm">
                {pagodaData.location}
              </span>
              <span className="text-[11px] px-2.5 py-1 bg-ink-900/5 text-ink-600 border border-ink-900/8 rounded-sm">
                {pagodaData.material}
              </span>
              <span className="text-[11px] px-2.5 py-1 bg-ink-900/5 text-ink-600 border border-ink-900/8 rounded-sm">
                {pagodaData.status}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.location.href = '/pointcloud'}
              className="mt-8 px-8 py-3 bg-stamp text-paper font-serif tracking-wider text-sm
                hover:bg-stamp/90 active:scale-[0.98] transition-all shadow-sm"
            >
              进入点云档案 →
            </button>
          </div>
        </div>

        {/* ───── 尺寸档案卡 ───── */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-xl text-ink-900 tracking-wider">结构尺寸</h2>
            <div className="flex-1 h-px bg-ink-900/10" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pagodaData.dimensions.map((d) => (
              <div key={d.label} className="glass-panel-light p-5 space-y-1">
                <span className="text-[10px] text-ink-500/60 tracking-widest uppercase">{d.label}</span>
                <p className="text-2xl font-serif text-ink-900">{d.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───── 底部朝代时间轴 ───── */}
        <DynastyCarousel />
      </div>
    </div>
  );
}

/** 应县木塔 SVG 插画 */
function TowerIllustration() {
  return (
    <svg viewBox="0 0 160 480" className="w-44 lg:w-52 h-auto" style={{ filter: 'drop-shadow(0 2px 12px rgba(44,36,22,0.08))' }}>
      <defs>
        <linearGradient id="towerGradA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A4030" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#2C1A0E" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="roofGradA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3020"/>
          <stop offset="100%" stopColor="#2C1A0E"/>
        </linearGradient>
      </defs>

      {/* 塔刹 */}
      <line x1="80" y1="12" x2="80" y2="44" stroke="#4A3728" strokeWidth="1.2"/>
      <circle cx="80" cy="12" r="3" fill="none" stroke="#6A5038" strokeWidth="0.8"/>
      <circle cx="80" cy="20" r="2.5" fill="none" stroke="#5A4030" strokeWidth="0.8"/>
      <circle cx="80" cy="27" r="2.2" fill="none" stroke="#5A4030" strokeWidth="0.7"/>
      <circle cx="80" cy="33" r="2" fill="none" stroke="#4A3728" strokeWidth="0.6"/>
      <circle cx="80" cy="38" r="1.8" fill="none" stroke="#4A3728" strokeWidth="0.5"/>

      {/* 9 层塔身 */}
      {Array.from({ length: 9 }, (_, i) => {
        const y = 50 + i * 44;
        const w = 80 - i * 4.5;
        const x = 80 - w / 2;
        const roofW = w + 14;
        const roofX = 80 - roofW / 2;
        return (
          <g key={i}>
            {/* 屋檐 */}
            <path
              d={`M${roofX},${y} Q${80},${y-10} ${roofX + roofW},${y}`}
              fill="url(#roofGradA)"
              stroke="#2C1A0E"
              strokeWidth="0.4"
            />
            {/* 塔身 */}
            <rect
              x={x} y={y} width={w} height={16} rx="1"
              fill="url(#towerGradA)"
              stroke="#2C1A0E"
              strokeWidth="0.3"
            />
            {/* 斗栱横线 */}
            <line x1={x-4} y1={y+4} x2={x+w+4} y2={y+4} stroke="#5A4030" strokeWidth="0.3" opacity="0.6"/>
            {/* 门洞 */}
            <rect x={x + w*0.35} y={y+5} width={w*0.3} height={7} rx="0" fill="none" stroke="#2C1A0E" strokeWidth="0.3" opacity="0.5"/>
            {/* 栏杆 */}
            <line x1={x+2} y1={y-2} x2={x+w-2} y2={y-2} stroke="#5A4030" strokeWidth="0.4" opacity="0.5"/>
            {/* 柱子 */}
            {[0.15, 0.85].map((p, j) => (
              <line key={j} x1={x + w*p} y1={y-2} x2={x + w*p} y2={y+16} stroke="#4A3020" strokeWidth="0.4" opacity="0.4"/>
            ))}
          </g>
        );
      })}

      {/* 基座 */}
      <rect x="26" y="450" width="108" height="10" rx="2" fill="#3A2818" stroke="#2C1A0E" strokeWidth="0.3"/>
      <rect x="18" y="460" width="124" height="7" rx="1" fill="#2C1A0E" stroke="#1A0E06" strokeWidth="0.3"/>
      {/* 台阶 */}
      <path d="M40,467 L60,480 L100,480 L120,467" fill="none" stroke="#3A2818" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}
