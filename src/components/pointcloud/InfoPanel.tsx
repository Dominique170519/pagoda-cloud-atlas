interface InfoPanelProps {
  vertexCount: number;
  viewMode: string;
  loading: boolean;
}

export default function InfoPanel({ vertexCount, viewMode, loading }: InfoPanelProps) {
  return (
    <div className="glass-panel p-4 space-y-4">
      <div>
        <h3 className="font-serif text-gold-400 text-sm tracking-wider mb-1">应县木塔</h3>
        <p className="text-[10px] text-ink-500 font-mono tracking-widest">YINGXIAN WOODEN PAGODA</p>
      </div>

      <div className="border-t border-ink-600/20 pt-3 space-y-2">
        {[
          ['朝代', '辽 · 清宁二年'],
          ['地点', '山西朔州应县'],
          ['高度', '67.31 m'],
          ['结构', '纯木 · 榫卯'],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[10px] text-ink-600">{label}</span>
            <span className="text-[11px] text-ink-300">{value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-600/20 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-ink-800/50 rounded px-2 py-1.5">
            <p className="text-[9px] text-ink-600 font-mono">POINTS</p>
            <p className="text-xs text-cyan font-mono">
              {loading ? '...' : vertexCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-ink-800/50 rounded px-2 py-1.5">
            <p className="text-[9px] text-ink-600 font-mono">MODE</p>
            <p className="text-xs text-gold-400 font-mono uppercase">
              {viewMode === 'cloud' ? 'PoINT' : viewMode === 'wireframe' ? 'LINE' : 'PHOTO'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-600/20 pt-3">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="text-[10px] text-ink-500 font-mono">
            {loading ? 'LOADING' : 'READY'}
          </span>
        </div>
      </div>
    </div>
  );
}
