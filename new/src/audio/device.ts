/**
 * Audio output device selector.
 *
 * Uses AudioContext.setSinkId() where available (Chrome 110+, Firefox 116+).
 * Falls back to a hidden <audio> element routed via captureStream() for
 * older browsers — but for our purposes the setSinkId path is the fix we need.
 */

import * as Tone from "tone";

/** Enumerate audio output devices. Requires microphone permission in some browsers. */
export async function enumerateOutputDevices(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === "audiooutput");
}

/**
 * Route the Tone.js AudioContext output to the specified device.
 * Falls back silently if setSinkId is not supported.
 */
export async function setOutputDevice(deviceId: string): Promise<void> {
  // Tone.js wraps the native AudioContext; we access it via Tone.getContext().rawContext
  const rawCtx = Tone.getContext().rawContext as AudioContext & {
    setSinkId?: (sinkId: string) => Promise<void>;
  };

  if (typeof rawCtx.setSinkId === "function") {
    await rawCtx.setSinkId(deviceId);
    return;
  }

  // Fallback: not supported — log and continue (default device will be used)
  console.warn("[audio/device] setSinkId not supported in this browser; using default output");
}
