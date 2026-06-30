import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/archive', label: 'Archive' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/pointcloud', label: 'Point Cloud' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-3 group">
        <span className="font-serif text-gold-400 text-lg tracking-wider">塔影云图</span>
        <span className="text-xs text-ink-500 font-mono tracking-widest group-hover:text-gold-500 transition-colors">
          PAGODA ATLAS
        </span>
      </NavLink>

      <div className="flex items-center gap-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="text-xs text-ink-500 font-mono">
        v1.0
      </div>
    </nav>
  );
}
