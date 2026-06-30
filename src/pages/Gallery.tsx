import { useState } from 'react';

const categories = ['全部', '实景', '线稿', '水墨', '风格化'];

const galleryItems = [
  { id: 1, title: '正面全景', category: '实景', size: 'large', desc: '应县木塔正面实景拍摄' },
  { id: 2, title: '结构线稿', category: '线稿', size: 'tall', desc: '剖面结构手绘线稿' },
  { id: 3, title: '雾中塔影', category: '水墨', size: 'normal', desc: '水墨渲染效果' },
  { id: 4, title: '点云俯视', category: '风格化', size: 'normal', desc: '点云俯视渲染' },
  { id: 5, title: '仰视视角', category: '实景', size: 'wide', desc: '仰视拍摄斗栱层叠' },
  { id: 6, title: '立面图', category: '线稿', size: 'tall', desc: '正立面建筑图纸' },
  { id: 7, title: '夜雨塔影', category: '风格化', size: 'normal', desc: '雨夜灯光风格化' },
  { id: 8, title: '檐角特写', category: '水墨', size: 'normal', desc: '飞檐水墨特写' },
  { id: 9, title: '雪景', category: '实景', size: 'wide', desc: '冬季雪后木塔' },
  { id: 10, title: '斗栱详图', category: '线稿', size: 'normal', desc: '斗栱结构详图' },
  { id: 11, title: '层叠渲染', category: '风格化', size: 'large', desc: '多层叠加风格化渲染' },
  { id: 12, title: '远山水墨', category: '水墨', size: 'tall', desc: '远山衬托下的塔影' },
];

export default function Gallery() {
  const [active, setActive] = useState('全部');

  const filtered = active === '全部'
    ? galleryItems
    : galleryItems.filter((item) => item.category === active);

  return (
    <div className="min-h-screen bg-ink-900 pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs text-ink-500 font-mono tracking-[0.3em] mb-4 uppercase">
            Visual Archive
          </p>
          <h1 className="font-serif text-5xl text-gold-400 tracking-wider mb-4">
            图像展廊
          </h1>
          <p className="text-ink-500/60 text-sm max-w-lg">
            实景、线稿、水墨、风格化——多种形式呈现应县木塔的建筑之美
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-sm tracking-wider transition-all duration-300
                ${active === cat
                  ? 'bg-ink-700 text-cyan border border-cyan/20'
                  : 'bg-ink-800 text-ink-500 border border-transparent hover:text-ink-300 hover:border-ink-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group relative break-inside-avoid overflow-hidden bg-ink-800 border border-ink-600/30 hover:border-gold-500/20 transition-all duration-500 cursor-pointer
                ${item.size === 'large' ? 'min-h-[400px]' : ''}
                ${item.size === 'tall' ? 'min-h-[480px]' : ''}
                ${item.size === 'wide' ? 'min-h-[280px]' : ''}
                ${item.size === 'normal' ? 'min-h-[320px]' : ''}
              `}
            >
              {/* Placeholder visual */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center p-8
                ${item.category === '实景' ? 'bg-gradient-to-b from-ink-700 to-ink-800' : ''}
                ${item.category === '线稿' ? 'bg-gradient-to-b from-ink-800 to-blue-950' : ''}
                ${item.category === '水墨' ? 'bg-gradient-to-b from-ink-800 to-gray-900' : ''}
                ${item.category === '风格化' ? 'bg-gradient-to-b from-ink-700 to-purple-950' : ''}
              `}>
                <div className={`w-16 h-16 rounded-full border mb-4 flex items-center justify-center
                  ${item.category === '实景' ? 'border-cyan/20 text-cyan/40' : ''}
                  ${item.category === '线稿' ? 'border-blue-400/20 text-blue-400/40' : ''}
                  ${item.category === '水墨' ? 'border-gray-400/20 text-gray-400/40' : ''}
                  ${item.category === '风格化' ? 'border-purple-400/20 text-purple-400/40' : ''}
                `}>
                  <svg viewBox="0 0 20 20" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="2" width="7" height="7" rx="1" />
                    <rect x="11" y="2" width="7" height="7" rx="1" />
                    <rect x="5" y="11" width="10" height="7" rx="1" />
                  </svg>
                </div>
                <p className="text-sm text-ink-300 font-serif">{item.title}</p>
                <p className="text-[10px] text-ink-600 mt-1">{item.desc}</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-gold-400 text-xs font-mono tracking-[0.2em] bg-ink-900/80 px-4 py-2">
                  查看大图
                </span>
              </div>

              {/* Category tag */}
              <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider
                ${item.category === '实景' ? 'bg-cyan/10 text-cyan border border-cyan/20' : ''}
                ${item.category === '线稿' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' : ''}
                ${item.category === '水墨' ? 'bg-gray-400/10 text-gray-400 border border-gray-400/20' : ''}
                ${item.category === '风格化' ? 'bg-purple-400/10 text-purple-400 border border-purple-400/20' : ''}
              `}>
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
