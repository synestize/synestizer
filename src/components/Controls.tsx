import { useAppStore } from '../store/useAppStore';

export function Controls() {
  const { isAudioRunning, startAudio, stopAudio } = useAppStore();

  const handleToggleAudio = () => {
    if (isAudioRunning) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleToggleAudio}
        className={`font-bold py-2 px-6 rounded text-lg transition-colors ${
          isAudioRunning
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isAudioRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}