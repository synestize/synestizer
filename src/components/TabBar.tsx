import { useAppStore, type TabName } from '../store/useAppStore';

const TABS: { id: TabName; label: string }[] = [
  { id: 'sound',       label: 'Sound'       },
  { id: 'settings',    label: 'Settings'    },
  { id: 'performance', label: 'Performance' },
  { id: 'about',       label: 'About'       },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="flex border-b border-gray-700 bg-gray-900 shrink-0">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors touch-manipulation
            ${activeTab === tab.id
              ? 'text-white border-b-2 border-indigo-400 bg-gray-800'
              : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
