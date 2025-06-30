import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { Controls } from './components/Controls';

function App() {
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoFeed />
        <Controls />
      </main>
    </div>
  );
}

export default App;