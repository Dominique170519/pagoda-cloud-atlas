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
      <p className="text-xs text-ink-500/60 tracking-[0.3em] text-center mb-6 uppercase">
        Browse by Dynasty
      </p>
      <div className="flex items-center justify-center gap-1">
        {dynasties.map((d) => (
          <div
            key={d.name}
            className={`flex flex-col items-center px-6 py-3 transition-all duration-300 cursor-pointer group
              ${d.highlight
                ? 'bg-stamp/10 border-b-2 border-stamp'
                : 'hover:bg-ink-900/5 border-b-2 border-transparent'
              }`}
          >
            <span className={`font-serif text-xl ${d.highlight ? 'text-stamp' : 'text-ink-600 group-hover:text-ink-800'}`}>
              {d.name}
            </span>
            <span className={`text-[10px] font-mono mt-0.5 ${d.highlight ? 'text-stamp/60' : 'text-ink-500/40'}`}>
              {Math.abs(d.start)}{d.start < 0 ? ' BC' : ''}
            </span>
          </div>
        ))}
      </div>
      {dynasties.find(d => d.highlight) && (
        <p className="text-center text-xs text-stamp/60 font-serif mt-4">
          ● 辽 · 清宁二年 —— 应县木塔始建之年
        </p>
      )}
    </div>
  );
}
