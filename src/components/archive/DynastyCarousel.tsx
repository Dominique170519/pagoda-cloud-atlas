const dynasties = [
  { name: '汉', start: -202, end: 220 },
  { name: '隋', start: 581, end: 618 },
  { name: '唐', start: 618, end: 907 },
  { name: '五代', start: 907, end: 960 },
  { name: '辽', start: 907, end: 1125, highlight: true },
  { name: '宋', start: 960, end: 1279 },
  { name: '元', start: 1271, end: 1368 },
  { name: '明', start: 1368, end: 1644 },
  { name: '清', start: 1644, end: 1912 },
];

export default function DynastyCarousel() {
  return (
    <div className="mt-20">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-serif text-xl text-ink-900 tracking-wider whitespace-nowrap">朝代纪年</h2>
        <div className="flex-1 h-px bg-ink-900/10" />
      </div>

      {/* Timeline bar */}
      <div className="relative pt-8 pb-12">
        {/* 主时间轴 */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-ink-900/10" />

        <div className="flex items-start justify-between relative">
          {dynasties.map((d, i) => (
            <div
              key={d.name}
              className="flex flex-col items-center group cursor-pointer relative z-10"
              style={{ width: `${100 / dynasties.length}%` }}
            >
              {/* Connector dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full mb-4 transition-all duration-300
                  ${d.highlight
                    ? 'bg-stamp shadow-[0_0_8px_rgba(184,65,42,0.3)] scale-125'
                    : 'bg-ink-900/15 group-hover:bg-ink-900/30'
                  }`}
              />

              {/* 朝代名 */}
              <span
                className={`font-serif text-base transition-colors duration-300
                  ${d.highlight
                    ? 'text-stamp font-bold'
                    : 'text-ink-500 group-hover:text-ink-700'
                  }`}
              >
                {d.name}
              </span>

              {/* 年份 */}
              <span
                className={`text-[10px] mt-1 font-mono transition-colors duration-300
                  ${d.highlight
                    ? 'text-stamp/60'
                    : 'text-ink-500/30 group-hover:text-ink-500/50'
                  }`}
              >
                {Math.abs(d.start)}{d.start < 0 ? 'BC' : ''}
              </span>

              {/* 高亮标记 */}
              {d.highlight && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  <div className="w-px h-6 bg-stamp/30" />
                  <div className="w-1 h-1 rounded-full bg-stamp/50" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 应县木塔标注线 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel-light">
            <div className="w-2 h-2 rounded-full bg-stamp" />
            <span className="text-xs text-stamp/80 font-serif">辽 · 清宁二年（1056）— 应县木塔始建</span>
          </div>
        </div>
      </div>
    </div>
  );
}
