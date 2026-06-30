import DynastyCarousel from '../components/archive/DynastyCarousel';
import ModelPreview from '../components/archive/ModelPreview';

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
    { label: '总高', value: '67.31', unit: 'm', icon: '↑' },
    { label: '底层直径', value: '30.27', unit: 'm', icon: '↔' },
    { label: '顶层直径', value: '19.74', unit: 'm', icon: '↔' },
    { label: '塔刹高', value: '10', unit: 'm', icon: '↑' },
    { label: '总重', value: '2,600', unit: '吨', icon: '⚖' },
    { label: '用材', value: '3,000', unit: 'm³', icon: '🌲' },
  ],
  stats: [
    { label: '层数', value: '9', note: '5明层 + 4暗层' },
    { label: '斗栱种类', value: '54', note: '形态各异，无一重复' },
    { label: '承重立柱', value: '312', note: '全塔结构骨架' },
    { label: '距今', value: '969', note: '辽清宁二年（1056）至今' },
  ],
};

export default function Archive() {
  return (
    <div className="min-h-screen bg-paper relative overflow-hidden">
      {/* 背景水墨山峦 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <svg viewBox="0 0 1440 900" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,650 Q200,500 400,580 Q600,660 800,520 Q1000,380 1200,480 Q1350,550 1440,500 L1440,900 L0,900Z" fill="#2C2416" />
          <path d="M0,700 Q300,560 550,640 Q800,720 1050,590 Q1250,500 1440,570 L1440,900 L0,900Z" fill="#2C2416" opacity="0.6" />
          <path d="M0,750 Q250,650 500,700 Q750,750 1000,660 Q1250,600 1440,670 L1440,900 L0,900Z" fill="#2C2416" opacity="0.3" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-24">
        {/* ───── Hero ───── */}
        <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 mb-24">
          {/* 左侧：3D 模型预览 */}
          <div className="flex-shrink-0 w-full lg:w-[420px]">
            <ModelPreview url="/models/pagoda-textured.glb" />
            {/* 模型下方标注 */}
            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-[10px] text-ink-400/60 font-mono tracking-wider">3D DIGITAL ARCHIVE</span>
              <span className="text-[10px] text-ink-400/60 font-mono">应县 · 山西</span>
            </div>
          </div>

          {/* 右侧：档案信息 */}
          <div className="flex-1 pt-6 lg:pt-8">
            {/* 红色印章装饰 */}
            <div className="flex items-start gap-5 mb-6">
              <div className="flex-shrink-0 mt-1 w-14 h-14 border-2 border-stamp/70 rounded flex items-center justify-center rotate-6">
                <span className="font-kaiti text-stamp text-[13px] leading-tight text-center">释迦<br />宝塔</span>
              </div>
              <div>
                <p className="text-[11px] text-ink-400/60 font-mono tracking-[0.4em] mb-1">{pagodaData.dynasty}</p>
                <h1 className="font-serif text-5xl lg:text-7xl text-ink-900 tracking-widest leading-tight">
                  {pagodaData.name}
                </h1>
                <p className="text-sm text-ink-500/60 font-mono tracking-[0.3em] mt-2">
                  {pagodaData.nameEn}
                </p>
              </div>
            </div>

            {/* 核心数据牌 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {pagodaData.stats.map((s) => (
                <div key={s.label} className="glass-panel-light px-5 py-4 hover:border-stamp/20 transition-colors">
                  <p className="text-[10px] text-ink-400/60 uppercase tracking-widest mb-2">{s.label}</p>
                  <span className="text-4xl font-serif text-ink-900 tabular-nums">{s.value}</span>
                  <p className="text-[11px] text-ink-500/50 mt-1.5 leading-tight">{s.note}</p>
                </div>
              ))}
            </div>

            {/* 描述 */}
            <div className="mt-8 max-w-xl">
              <p className="text-sm text-ink-700 leading-relaxed">
                {pagodaData.description}
              </p>
            </div>

            {/* 标签行 */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-[11px] px-3 py-1.5 bg-stamp/5 text-stamp border border-stamp/15 rounded-sm font-medium">
                {pagodaData.dynasty}
              </span>
              <span className="text-[11px] px-3 py-1.5 bg-ink-900/[0.04] text-ink-600 border border-ink-900/8 rounded-sm">
                {pagodaData.location}
              </span>
              <span className="text-[11px] px-3 py-1.5 bg-ink-900/[0.04] text-ink-600 border border-ink-900/8 rounded-sm">
                {pagodaData.material}
              </span>
              <span className="text-[11px] px-3 py-1.5 bg-stamp/5 text-stamp/80 border border-stamp/10 rounded-sm">
                {pagodaData.status}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.location.href = '/pointcloud'}
              className="mt-10 px-10 py-3.5 bg-stamp text-paper font-serif tracking-[0.2em] text-sm
                hover:bg-stamp/90 active:scale-[0.98] transition-all shadow-sm rounded-sm"
            >
              进入点云档案 →
            </button>
          </div>
        </div>

        {/* ───── 结构尺寸 ───── */}
        <section className="mb-24">
          <div className="flex items-center gap-5 mb-8">
            <h2 className="font-serif text-2xl text-ink-900 tracking-wider">结构数据</h2>
            <div className="flex-1 h-px bg-ink-900/10" />
            <span className="text-[10px] text-ink-400/50 font-mono tracking-wider">STRUCTURAL DATA</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pagodaData.dimensions.map((d) => (
              <div key={d.label} className="glass-panel-light p-5 flex flex-col justify-between hover:border-stamp/15 transition-colors">
                <span className="text-[10px] text-ink-400/60 tracking-widest uppercase">{d.label}</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-serif text-ink-900 tabular-nums">{d.value}</span>
                  <span className="text-xs text-ink-500/40">{d.unit}</span>
                </div>
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
