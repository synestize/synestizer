/**
 * Camera capture — wraps getUserMedia({ video: true }).
 */

export interface CameraOptions {
  width?: number;
  height?: number;
}

export interface CameraResult {
  stream: MediaStream;
  videoEl: HTMLVideoElement;
  stop: () => void;
}

export async function startCamera(opts: CameraOptions = {}): Promise<CameraResult> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: opts.width ?? 320 },
      height: { ideal: opts.height ?? 240 },
      facingMode: "environment",
    },
  });

  const videoEl = document.createElement("video");
  videoEl.srcObject = stream;
  videoEl.playsInline = true;
  videoEl.muted = true;
  await videoEl.play();

  const stop = () => {
    videoEl.pause();
    videoEl.srcObject = null;
    for (const track of stream.getTracks()) track.stop();
  };

  return { stream, videoEl, stop };
}
