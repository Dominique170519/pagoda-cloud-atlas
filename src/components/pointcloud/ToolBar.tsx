import type { ToolMode } from '../../hooks/usePointCloud';

interface ToolBarProps {
  activeTool: ToolMode;
  onSelect: (tool: ToolMode) => void;
  onScanToggle: () => void;
  onWipeToggle: () => void;
  isExploded: boolean;
  scanActive: boolean;
  wipeActive: boolean;
}

const tools: { id: ToolMode; label: string; icon: string }[] = [
  { id: 'rotate', label: '旋转', icon: 'rotate' },
  { id: 'measure', label: '测量', icon: 'measure' },
  { id: 'slice', label: '剖切', icon: 'slice' },
  { id: 'explode', label: '爆炸', icon: 'explode' },
  { id: 'restore', label: '复原', icon: 'restore' },
];

function ToolIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? '#00D4FF' : '#777';
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={color} strokeWidth="1.2">
      {icon === 'rotate' && (
        <>
          <path d="M12 3a9 9 0 1 0 9 9" />
          <polyline points="17,3 21,3 21,7" />
        </>
      )}
      {icon === 'measure' && (
        <>
          <line x1="3" y1="21" x2="21" y2="3" />
          <line x1="3" y1="16" x2="3" y2="21" /><line x1="8" y1="21" x2="3" y2="21" />
          <line x1="16" y1="8" x2="21" y2="3" /><line x1="21" y1="3" x2="21" y2="8" />
        </>
      )}
      {icon === 'slice' && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="2,2" />
        </>
      )}
      {icon === 'explode' && (
        <>
          <polygon points="12,2 17,7 14,7 14,12 10,12 10,7 7,7" />
          <polygon points="7,12 10,12 10,14 17,14" opacity="0.5" />
          <line x1="12" y1="12" x2="12" y2="17" opacity="0.5" />
          <line x1="10" y1="17" x2="14" y2="17" opacity="0.5" />
        </>
      )}
      {icon === 'restore' && (
        <>
          <polyline points="7,7 12,12 7,17" />
          <polyline points="13,7 18,12 13,17" />
          <line x1="8" y1="12" x2="17" y2="12" strokeDasharray="2,1.5" />
        </>
      )}
    </svg>
  );
}

/** Mode indicator shown below active tool buttons */
const modeHints: Record<string, string> = {
  measure: '点击两点\n测量距离',
  slice: '拖动平面\n剖切视图',
  wipe: '拖拽切换\n点云↔模型',
};

export default function ToolBar({ activeTool, onSelect, onScanToggle, onWipeToggle, isExploded, scanActive, wipeActive }: ToolBarProps) {
  const hint = wipeActive ? modeHints.wipe : modeHints[activeTool];

  return (
    <div className="glass-panel p-2 flex flex-col gap-1">
      {tools.map((tool) => {
        const isExplodeActive = tool.id === 'explode' && isExploded;
        const isActive = isExplodeActive || activeTool === tool.id;
        const canRestore = tool.id !== 'restore' || isExploded;
        return (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            disabled={!canRestore}
            className={`tool-btn ${isActive ? 'active' : ''} ${!canRestore ? 'opacity-30 cursor-not-allowed' : ''}`}
            title={tool.label}
          >
            <ToolIcon icon={tool.icon} active={isActive && canRestore} />
            <span className="text-[10px] leading-none">{tool.label}</span>
          </button>
        );
      })}

      {/* Separator */}
      <div className="border-t border-ink-600/30 my-1" />

      {/* Scan / Wipe button */}
      <button
        onClick={onWipeToggle}
        className={`tool-btn ${wipeActive ? 'active' : ''}`}
        title="扫描切换"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"
          stroke={wipeActive ? '#00D4FF' : '#777'} strokeWidth="1.2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5" />
          <line x1="6" y1="12" x2="18" y2="12" strokeDasharray="2,1.5" opacity="0.4" />
          <polyline points="9,8 12,5 15,8" opacity="0.6" />
          <polyline points="9,16 12,19 15,16" opacity="0.6" />
        </svg>
        <span className="text-[10px] leading-none">切换</span>
      </button>

      {/* Mode hint */}
      {hint && (
        <div className="mt-1 px-1 py-1.5 text-[10px] leading-relaxed text-cyan/70 text-center border-t border-cyan/10">
          {hint.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
