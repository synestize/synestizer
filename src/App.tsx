import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { Controls } from './components/Controls';
import { useWebcam } from './hooks/useWebcam';
import { useAppStore } from './store/useAppStore';
import { useEffect } from 'react';

function App() {
  const { videoRef, canvasRef, error, startWebcam, stopWebcam } = useWebcam();
  const { isAudioRunning } = useAppStore();

  useEffect(() => {
    // This effect synchronizes the webcam with the global audio state
    if (isAudioRunning) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isAudioRunning, startWebcam, stopWebcam]);

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoFeed videoRef={videoRef} />
        <Controls />
        {error && <div className="mt-4 p-2 bg-red-800 text-white rounded">{error}</div>}
      </main>
      {/* The canvas is required for processing but should not be visible to the user */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;