import { useEffect, useRef, useState } from 'react';
import { audioService } from '../services/audioService';
import { signalBus, THUMB_W, THUMB_H, type ThumbKey, type BusData } from './useSignalBus';
import type { SignalName } from '../store/useAppStore';

export function useWebcam() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // RAF loop handle — the single source of truth for whether processing is running
  const rafRef    = useRef<number | null>(null);
  // Backpressure: only one frame in-flight to the worker at a time
  const workerBusy = useRef(false);

  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const worker = new Worker(
        new URL('../workers/featureExtractor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<{ signals: Record<string, number>; thumbs: Record<string, ArrayBuffer> }>) => {
        workerBusy.current = false; // release backpressure

        const { signals, thumbs } = event.data;
        audioService.update(signals as Record<SignalName, number>);

        const reconstructed = {} as Record<ThumbKey, ImageData>;
        for (const key of Object.keys(thumbs) as ThumbKey[]) {
          reconstructed[key] = new ImageData(new Uint8ClampedArray(thumbs[key]), THUMB_W, THUMB_H);
        }
        const busData: BusData = { signals: signals as Record<SignalName, number>, thumbs: reconstructed };
        signalBus.latest = busData;
        signalBus.listeners.forEach(fn => fn(busData));
      };

      worker.onerror = (err) => {
        console.error('Worker error:', err);
        setError('Video processing worker failed');
      };

      workerRef.current = worker;
    } catch (err) {
      console.error('Failed to create worker:', err);
      setError('Failed to initialize video processing');
    }

    return () => {
      stopLoop();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startLoop = (video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Prevent duplicate loops
    stopLoop();

    // Draw at thumbnail resolution — 80×45 instead of 640×480.
    // This cuts worker computation from 307 k pixels to 3.6 k pixels (64×).
    canvas.width  = THUMB_W;
    canvas.height = THUMB_H;

    let lastProcessTime = 0;
    const frameInterval = 1000 / 15; // 15 fps cap

    const tick = () => {
      // Check via the DOM ref — no stale closure on React state
      if (!videoRef.current?.srcObject) {
        rafRef.current = null;
        return;
      }

      const now = Date.now();
      if (now - lastProcessTime >= frameInterval && !workerBusy.current && workerRef.current) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Zero-copy: transfer the underlying buffer to the worker
        workerBusy.current = true;
        workerRef.current.postMessage(
          { data: imageData.data.buffer, width: canvas.width, height: canvas.height },
          [imageData.data.buffer]
        );
        lastProcessTime = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const startWebcam = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      video.srcObject = stream;
      setIsWebcamActive(true);

      const begin = () => startLoop(video, canvas, ctx);

      if (video.readyState >= 2) {
        begin();
      } else {
        video.addEventListener('loadedmetadata', begin, { once: true });
      }
    } catch (err) {
      console.error('Failed to access webcam:', err);
      setError('Failed to access webcam. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    stopLoop();
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  return { videoRef, canvasRef, isWebcamActive, error, startWebcam, stopWebcam };
}
