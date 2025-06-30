import { useEffect, useRef, useState } from 'react';
import { audioService } from '../services/audioService';

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../workers/featureExtractor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Handle messages from worker
      workerRef.current.onmessage = (event: MessageEvent<{ brightness: number }>) => {
        const { brightness } = event.data;
        // Direct bridge to audio service - bypasses React state
        audioService.update(brightness);
      };

      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
        setError('Video processing worker failed');
      };
    } catch (err) {
      console.error('Failed to create worker:', err);
      setError('Failed to initialize video processing');
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        startProcessing();
      }
    } catch (err) {
      console.error('Failed to access webcam:', err);
      setError('Failed to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
    stopProcessing();
  };

  const startProcessing = () => {
    if (!videoRef.current || !canvasRef.current || !workerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    let lastProcessTime = 0;
    const processInterval = 1000 / 15; // Throttle to 15 FPS

    const processFrame = () => {
      if (!isWebcamActive || !video.videoWidth) {
        requestAnimationFrame(processFrame);
        return;
      }

      const now = Date.now();
      if (now - lastProcessTime >= processInterval) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data and send to worker
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        workerRef.current?.postMessage(imageData);
        
        lastProcessTime = now;
      }

      if (isWebcamActive) {
        requestAnimationFrame(processFrame);
      }
    };

    // Start processing when video is ready
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      processFrame();
    });

    if (video.readyState >= 2) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      processFrame();
    }
  };

  const stopProcessing = () => {
    // Processing will stop when isWebcamActive becomes false
  };

  return {
    videoRef,
    canvasRef, // Hidden canvas for processing
    isWebcamActive,
    error,
    startWebcam,
    stopWebcam,
  };
}