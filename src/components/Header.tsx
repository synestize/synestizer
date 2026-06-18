import { useAppStore } from '../store/useAppStore';

export function Header() {
  const { isSignalDrawerOpen, setSignalDrawerOpen, isAudioRunning } = useAppStore();

  return (
    <header className="bg-gray-900 text-white px-4 py-3 border-b border-gray-700 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold tracking-tight">Synestizer</h1>
        {/* Live indicator */}
        {isAudioRunning && (
          <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        )}
      </div>
      <button
        onClick={() => setSignalDrawerOpen(!isSignalDrawerOpen)}
        title="Signal channels"
        className={`p-2 rounded transition-colors text-sm font-mono
          ${isSignalDrawerOpen
            ? 'bg-indigo-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
      >
        ≋
      </button>
    </header>
  );
}
