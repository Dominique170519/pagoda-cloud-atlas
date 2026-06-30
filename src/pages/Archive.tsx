import DynastyCarousel from '../components/archive/DynastyCarousel';

const pagodaData = {
  name: '应县木塔',
  nameEn: 'Yingxian Wooden Pagoda',
  aka: '佛宫寺释迦塔',
  dynasty: '辽 · 清宁二年',
  year: '1056',
  location: '山西省朔州市应县',
  height: '67.31 m',
  floors: '9层 (5明4暗)',
  material: '纯木结构 · 榫卯',
  status: '中国现存最高木构建筑',
  description: `应县木塔，全称佛宫寺释迦塔，位于山西省朔州市应县城内
西北佛宫寺内。建于辽清宁二年（公元1056年），金明昌六年（公元
1195年）增修完毕，是世界上现存最高大、最古老的纯木结构楼阁式建筑。

全塔耗材红松木料3000立方米，约2600多吨，纯木结构、无钉无铆。塔内
供奉着两颗释迦牟尼佛牙舍利。`,
};

export default function Archive() {
  return (
    <div className="min-h-screen bg-paper relative overflow-x-hidden">
      {/* 水墨山水背景 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 1200 800" className="w-full h-full">
          <path
            d="M0,600 Q150,400 300,480 Q450,560 600,420 Q750,280 900,390 Q1050,500 1200,360 L1200,800 L0,800 Z"
            fill="#2C2416"
          />
          <path
            d="M0,650 Q200,520 400,580 Q600,640 800,540 Q1000,440 1200,510 L1200,800 L0,800 Z"
            fill="#2C2416"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 pt-32 pb-20">
        {/* 右竖排标题 */}
        <div className="absolute right-12 top-32 writing-vertical text-3xl font-kaiti text-ink-900/10 tracking-[0.5em] select-none">
          應縣木塔
        </div>

        {/* Hero */}
        <div className="grid grid-cols-12 gap-8 mb-20">
          {/* 左侧信息 */}
          <div className="col-span-3 space-y-6 pt-12">
            <div className="glass-panel-light p-5 space-y-4">
              <div>
                <p className="text-xs text-ink-500/60 tracking-widest uppercase mb-1">Dynasty</p>
                <p className="text-lg font-serif text-ink-900">{pagodaData.dynasty}</p>
                <p className="text-sm font-serif text-ink-500/60">{pagodaData.year}</p>
              </div>
              <div className="border-t border-paper-dark/30 pt-4">
                <p className="text-xs text-ink-500/60 tracking-widest uppercase mb-1">Location</p>
                <p className="text-sm text-ink-800 leading-relaxed">{pagodaData.location}</p>
              </div>
            </div>

            <div className="glass-panel-light p-5 space-y-2">
              {[
                ['高度', pagodaData.height],
                ['层数', pagodaData.floors],
                ['结构', pagodaData.material],
                ['地位', pagodaData.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-xs text-ink-500/60">{label}</span>
                  <span className="text-sm text-ink-800 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 中央塔图 */}
          <div className="col-span-6 flex flex-col items-center">
            <h1 className="font-serif text-5xl text-ink-900 tracking-widest mb-2">
              {pagodaData.name}
            </h1>
            <p className="text-sm text-stamp/70 font-mono tracking-[0.3em] mb-8">
              {pagodaData.nameEn}
            </p>

            {/* 塔形 SVG 插画 */}
            <div className="w-64 h-96 relative flex items-center justify-center">
              <svg viewBox="0 0 160 440" className="w-full h-full">
                <defs>
                  <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A3728" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#2C2416" stopOpacity="1"/>
                  </linearGradient>
                </defs>

                {/* 塔刹 */}
                <line x1="80" y1="20" x2="80" y2="50" stroke="#4A3728" strokeWidth="1.5"/>
                <circle cx="80" cy="18" r="4" fill="none" stroke="#4A3728" strokeWidth="1"/>
                <circle cx="80" cy="26" r="3" fill="none" stroke="#4A3728" strokeWidth="0.8"/>
                <circle cx="80" cy="34" r="2.5" fill="none" stroke="#4A3728" strokeWidth="0.6"/>

                {/* 9层塔身 */}
                {(() => {
                  const layers = [];
                  for (let i = 0; i < 9; i++) {
                    const y = 60 + i * 40;
                    const w = 76 - i * 4;
                    const x = 80 - w / 2;
                    // roof
                    layers.push(<path key={`roof-${i}`} d={`M${x-6},${y} L${80},${y-8} L${x+w+6},${y}`} fill="#3A2818" stroke="#2C1A0E" strokeWidth="0.5"/>);
                    // body
                    layers.push(<rect key={`body-${i}`} x={x} y={y} width={w} height={18} rx="1" fill="url(#towerGrad)" stroke="#2C1A0E" strokeWidth="0.3"/>);
                    // bracket lines
                    layers.push(<line key={`b1-${i}`} x1={x-6} y1={y+4} x2={x} y2={y+4} stroke="#5A4A38" strokeWidth="0.3"/>);
                    layers.push(<line key={`b2-${i}`} x1={x+w} y1={y+4} x2={x+w+6} y2={y+4} stroke="#5A4A38" strokeWidth="0.3"/>);
                    // eaves brackets
                    for (let j = 0; j < 3; j++) {
                      const bx = x + 6 + j * (w - 12) / 2;
                      layers.push(<rect key={`br-${i}-${j}`} x={bx-3} y={y+8} width="6" height="8" rx="0.5" fill="#3A2818" opacity="0.6"/>);
                    }
                  }
                  return layers;
                })()}

                {/* 基座 */}
                <rect x="30" y="420" width="100" height="12" rx="2" fill="#3A2818" stroke="#2C1A0E" strokeWidth="0.3"/>
                <rect x="24" y="432" width="112" height="8" rx="1" fill="#2C1A0E" stroke="#1A0E06" strokeWidth="0.3"/>
              </svg>
            </div>

            <button
              onClick={() => window.location.href = '/pointcloud'}
              className="mt-6 px-8 py-3 bg-stamp text-paper font-serif tracking-wider hover:bg-stamp/90 transition-colors"
            >
              进入点云模型
            </button>
          </div>

          {/* 右侧描述 */}
          <div className="col-span-3 space-y-6 pt-12">
            <div className="glass-panel-light p-5">
              <p className="text-xs text-ink-500/60 tracking-widest uppercase mb-3">Introduction</p>
              <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">
                {pagodaData.description}
              </p>
            </div>

            <div className="glass-panel-light p-5">
              <p className="text-xs text-ink-500/60 tracking-widest uppercase mb-3">Also Known As</p>
              <p className="text-lg font-serif text-ink-800">{pagodaData.aka}</p>
            </div>
          </div>
        </div>

        {/* 底部朝代轮播 */}
        <DynastyCarousel />

        {/* 底部装饰 */}
        <div className="mt-16 flex justify-center">
          <div className="w-8 h-8 border border-stamp/30 rotate-45" />
        </div>
      </div>
    </div>
  );
}
