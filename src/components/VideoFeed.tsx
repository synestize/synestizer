import { type RefObject } from 'react';

interface VideoFeedProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  fill?: boolean;
}

export function VideoFeed({ videoRef, fill = false }: VideoFeedProps) {
  return (
    <div className={fill ? 'w-full h-full' : 'aspect-video w-full'}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}
