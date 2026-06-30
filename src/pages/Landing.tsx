import { useNavigate } from 'react-router-dom';
import LandingParticles from '../components/landing/LandingParticles';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ink-900">
      <LandingParticles />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div className="animate-fade-in text-center" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-gold-500/40 text-sm font-mono tracking-[0.3em] uppercase">
              Digital Archive
            </span>
          </div>

          <h1 className="font-serif text-7xl md:text-8xl text-gold-400 tracking-wider mb-6">
            塔影云图
          </h1>

          <h2 className="text-2xl md:text-3xl font-serif text-ink-400 mb-10 tracking-widest">
            PAGODA CLOUD ATLAS
          </h2>

          <p className="text-ink-500/60 text-sm max-w-md mx-auto mb-12 leading-relaxed">
            应县木塔 · 辽清宁二年 · 中国现存最高木构建筑<br />
            以点云技术重建千年木塔的数字档案
          </p>

          <button
            onClick={() => navigate('/archive')}
            className="group relative px-10 py-4 bg-transparent border border-gold-500/30 text-gold-400 font-serif text-lg tracking-widest overflow-hidden transition-all duration-500 hover:border-gold-400 hover:bg-gold-500/10"
          >
            <span className="relative z-10 group-hover:text-gold-200 transition-colors">
              探索档案
            </span>
            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-500" />
          </button>

          <p className="mt-12 text-ink-600 text-xs font-mono tracking-widest animate-pulse-gold">
            SCROLL TO BEGIN
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-4 h-8 rounded-full border border-gold-500/20 flex items-start justify-center">
          <div className="w-1 h-2 bg-gold-400/40 rounded-full mt-1 animate-pulse-gold" />
        </div>
      </div>
    </div>
  );
}
