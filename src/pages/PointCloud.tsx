import { useEffect } from 'react';
import { usePointCloud } from '../hooks/usePointCloud';
import PointCloudCanvas from '../components/pointcloud/PointCloudCanvas';
import ToolBar from '../components/pointcloud/ToolBar';
import LayerSelector from '../components/pointcloud/LayerSelector';
import InfoPanel from '../components/pointcloud/InfoPanel';

export default function PointCloud() {
  const {
    state,
    loadGLB,
    loadOBJ,
    loadProcedural,
    setViewMode,
    setActiveTool,
    toggleExplode,
    toggleScan,
    setNumLayers,
    triggerRestore,
  } = usePointCloud();

  // Load model on mount: GLB → OBJ → procedural fallback
  useEffect(() => {
    // Try GLB first (new AI-generated model)
    fetch('/models/pagoda.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          console.log('[PointCloud] GLB file found, loading...');
          loadGLB('/models/pagoda.glb');
        } else {
          throw new Error('GLB not found');
        }
      })
      .catch(() => {
        // Fallback: try OBJ
        fetch('/models/pagoda.obj', { method: 'HEAD' })
          .then((res) => {
            if (res.ok) {
              loadOBJ('/models/pagoda.obj');
            } else {
              loadProcedural();
            }
          })
          .catch(() => {
            loadProcedural();
          });
      });
  }, []);

  const handleToolSelect = (tool: string) => {
    if (tool === 'explode') {
      toggleExplode();
    } else if (tool === 'restore') {
      triggerRestore();
    } else if (tool === 'rotate') {
      setActiveTool('rotate');
    } else if (tool === 'measure') {
      setActiveTool('measure');
    } else if (tool === 'slice') {
      setActiveTool('slice');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-ink-900 pt-20">
      {/* Full canvas */}
      <div className="absolute inset-0 pt-20">
        {state.vertices && (
          <PointCloudCanvas
            vertices={state.vertices}
            isExploded={state.isExploded}
            layers={state.layers}
            viewMode={state.viewMode}
            scanActive={state.scanActive}
          />
        )}
      </div>

      {/* Loading overlay */}
      {state.loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink-900/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
            <p className="text-xs text-ink-500 font-mono tracking-widest">LOADING MODEL</p>
          </div>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 glass-panel p-4 text-red-400 text-xs z-20">
          Error: {state.error}
        </div>
      )}

      {/* Left - Info Panel */}
      <div className="absolute left-6 top-24 z-10 w-48">
        <InfoPanel
          vertexCount={state.vertexCount}
          viewMode={state.viewMode}
          loading={state.loading}
        />
      </div>

      {/* Right - Toolbar */}
      <div className="absolute right-6 top-24 z-10">
        <ToolBar
          activeTool={state.activeTool}
          onSelect={handleToolSelect}
          onScanToggle={toggleScan}
          isExploded={state.isExploded}
          scanActive={state.scanActive}
        />
      </div>

      {/* Right Bottom - Layer Selector */}
      <div className="absolute right-6 bottom-8 z-10">
        <LayerSelector
          numLayers={state.numLayers}
          layers={state.layers}
          onChange={setNumLayers}
        />
      </div>

      {/* Bottom Center - View Mode Tabs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-panel flex gap-0 p-0.5">
          {([
            ['实景', 'photo'],
            ['线稿', 'wireframe'],
            ['点云', 'cloud'],
          ] as const).map(([label, mode]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-2 text-xs tracking-wider transition-all duration-200
                ${state.viewMode === mode
                  ? 'bg-ink-700 text-cyan'
                  : 'text-ink-500 hover:text-ink-300'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Bottom - Scan toggle */}
      <div className="absolute right-6 bottom-52 z-10">
        <button
          onClick={toggleScan}
          className={`text-[10px] font-mono tracking-wider px-3 py-1.5 rounded transition-all
            ${state.scanActive
              ? 'bg-cyan/10 text-cyan border border-cyan/20'
              : 'text-ink-600 border border-ink-700 hover:text-ink-400'
            }`}
        >
          SCAN {state.scanActive ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
