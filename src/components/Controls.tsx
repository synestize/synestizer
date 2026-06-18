import { useAppStore } from '../store/useAppStore';

export function Controls() {
  const { isAudioRunning, startAudio, stopAudio } = useAppStore();

  return (
    <button
      onClick={isAudioRunning ? stopAudio : startAudio}
      style={{
        padding: '6px 28px',
        fontWeight: 700,
        fontSize: '0.85rem',
        letterSpacing: '0.06em',
        borderRadius: 6,
        border: 'none',
        cursor: 'pointer',
        background: isAudioRunning ? '#dc2626' : '#16a34a',
        color: '#fff',
        transition: 'background 150ms',
        boxShadow: isAudioRunning ? '0 0 12px rgba(220,38,38,0.4)' : '0 0 12px rgba(22,163,74,0.4)',
      }}
    >
      {isAudioRunning ? 'Stop' : 'Start'}
    </button>
  );
}
