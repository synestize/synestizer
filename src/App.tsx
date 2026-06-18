import { useEffect } from 'react';
import { AppBar }       from './components/AppBar';
import { VideoFeed }    from './components/VideoFeed';
import { Controls }     from './components/Controls';
import { SignalDrawer } from './components/SignalDrawer';
import { SoundTab }     from './components/tabs/SoundTab';
import { SettingsTab }  from './components/tabs/SettingsTab';
import { AboutTab }     from './components/tabs/AboutTab';
import { useWebcam }    from './hooks/useWebcam';
import { useAppStore }  from './store/useAppStore';

function App() {
  const { videoRef, canvasRef, error, startWebcam, stopWebcam } = useWebcam();
  const { isAudioRunning, activeTab } = useAppStore();
  const isPerformance = activeTab === 'performance';

  useEffect(() => {
    if (isAudioRunning) startWebcam();
    else stopWebcam();
  }, [isAudioRunning, startWebcam, stopWebcam]);

  return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── AppBar always on top ── */}
      <AppBar />

      {/* ── Camera fills all remaining space, always visible ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
        <VideoFeed videoRef={videoRef} fill />

        {/* Performance mode — camera fully unobscured, floating controls only */}
        {isPerformance && (
          <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              <Controls />
            </div>
            {error && <span style={{ fontSize: '0.75rem', color: '#f87171', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4 }}>{error}</span>}
          </div>
        )}

        {/* Sound / Settings / About — dark scrim over camera + scrollable content */}
        {!isPerformance && (
          <div className="tab-scrim">
            {/* Start / Stop bar */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Controls />
              {error && <span style={{ fontSize: '0.75rem', color: '#f87171' }}>{error}</span>}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeTab === 'sound'    && <SoundTab />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'about'    && <AboutTab />}
            </div>
          </div>
        )}
      </div>

      <SignalDrawer />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
