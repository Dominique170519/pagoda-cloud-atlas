import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Archive from './pages/Archive';
import Gallery from './pages/Gallery';
import PointCloud from './pages/PointCloud';

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-ink-200 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/pointcloud" element={<PointCloud />} />
      </Routes>
    </div>
  );
}
