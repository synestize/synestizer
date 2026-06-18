import { useAppStore } from '../store/useAppStore';
import { SignalPanel } from './SignalPanel';

export function SignalDrawer() {
  const { isSignalDrawerOpen, setSignalDrawerOpen } = useAppStore();

  return (
    <>
      {isSignalDrawerOpen && (
        <div className="drawer-backdrop" onClick={() => setSignalDrawerOpen(false)} />
      )}

      <aside className={`signal-drawer ${isSignalDrawerOpen ? 'open' : 'closed'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Signal Channels
          </span>
          <button
            onClick={() => setSignalDrawerOpen(false)}
            style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '2px 6px', lineHeight: 1 }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <SignalPanel compact />
        </div>
      </aside>
    </>
  );
}
