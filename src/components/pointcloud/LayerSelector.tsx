interface LayerSelectorProps {
  numLayers: number;
  layers: { layerIndex: number; color: [number, number, number] }[];
  onChange: (num: number) => void;
}

const LAYER_LABELS = ['九层', '八层', '七层', '六层', '五层', '四层', '三层', '二层', '一层'];

export default function LayerSelector({ numLayers, layers, onChange }: LayerSelectorProps) {
  return (
    <div className="glass-panel p-3 flex flex-col gap-1.5">
      <p className="text-[10px] text-ink-500 font-mono tracking-wider text-center mb-1">层级</p>
      {LAYER_LABELS.map((label, i) => {
        const idx = LAYER_LABELS.length - 1 - i;
        const isActive = idx < numLayers;
        const layerInfo = layers.find(l => l.layerIndex === idx);
        const color = layerInfo
          ? `rgb(${Math.round(layerInfo.color[0] * 255)},${Math.round(layerInfo.color[1] * 255)},${Math.round(layerInfo.color[2] * 255)})`
          : '#555';

        return (
          <button
            key={label}
            onClick={() => {
              const newNum = idx + 1;
              if (newNum !== numLayers) onChange(newNum);
            }}
            className={`flex items-center gap-2 px-2 py-1 rounded text-[11px] transition-all duration-200
              ${isActive ? 'text-ink-200' : 'text-ink-600 line-through'}
              hover:bg-ink-600/30
              ${idx === numLayers - 1 ? 'bg-cyan/5 border-l border-cyan/30' : ''}
            `}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color, opacity: isActive ? 0.9 : 0.15 }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
