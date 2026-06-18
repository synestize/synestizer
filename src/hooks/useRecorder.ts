import { useState, useRef, useCallback } from 'react';

const MAX_SECONDS = 15;

export function useRecorder(onBlob: (blob: Blob, url: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef        = useRef<MediaStream | null>(null);

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    mediaRecorderRef.current?.stop(); // triggers onstop → onBlob
    setIsRecording(false);
    setSecondsLeft(MAX_SECONDS);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream);
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        onBlob(blob, url);
      };

      mr.start(100); // collect data every 100ms
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setSecondsLeft(MAX_SECONDS);

      let remaining = MAX_SECONDS;
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setSecondsLeft(remaining);
        if (remaining <= 0) stopRecording();
      }, 1000);

    } catch {
      console.error('Microphone access denied');
    }
  }, [onBlob, stopRecording]);

  return { isRecording, secondsLeft, startRecording, stopRecording };
}
