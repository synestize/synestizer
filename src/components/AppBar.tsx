import { useAppStore, type TabName } from '../store/useAppStore';

const TABS: { id: TabName; label: string }[] = [
  { id: 'sound',       label: 'Sound'       },
  { id: 'settings',    label: 'Settings'    },
  { id: 'performance', label: 'Performance' },
  { id: 'about',       label: 'About'       },
];

export function AppBar() {
  const { activeTab, setActiveTab, isSignalDrawerOpen, setSignalDrawerOpen, isAudioRunning } = useAppStore();

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', height: 44, flexShrink: 0, background: '#0a0a0f', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Tabs */}
      <nav style={{ display: 'flex', flex: 1, overflowX: 'auto' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '0 8px',
                fontSize: '0.8rem',
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid #818cf8' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 150ms, background 150ms',
                touchAction: 'manipulation',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right side: live dot + drawer toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        {isAudioRunning && (
          <span
            title="Running"
            style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', flexShrink: 0, boxShadow: '0 0 6px #4ade80' }}
          />
        )}
        <button
          onClick={() => setSignalDrawerOpen(!isSignalDrawerOpen)}
          title="Signal channels"
          style={{
            width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
            background: isSignalDrawerOpen ? 'rgba(99,102,241,0.35)' : 'transparent',
            color: isSignalDrawerOpen ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'background 150ms, color 150ms',
          }}
        >
          ≋
        </button>
      </div>
    </div>
  );
}
