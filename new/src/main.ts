/**
 * Synestizer entry point.
 *
 * Stage 4 smoke-test scaffolding:
 *   - ConfigStore + SignalBus + Scheduler boot empty.
 *   - "Start audio" button creates AudioEngine + AudioBinder, instantiates a basic voice.
 *   - "Start camera" button starts the video pipeline, registering 60 video sources.
 *   - Master gain/mute slider edits ConfigStore.master.
 *
 * Real UI (matrix, sliders, web components) lands in Stage 5.
 */

import { AudioBinder } from "./audio/binder.ts";
import { enumerateOutputDevices, setOutputDevice } from "./audio/device.ts";
import { AudioEngine } from "./audio/engine.ts";
import { SignalBus } from "./signal/bus.ts";
import { compileGraph } from "./signal/graph.ts";
import { Scheduler } from "./signal/scheduler.ts";
import { ConfigStore } from "./store/config-store.ts";
import { type CameraResult, startCamera } from "./video/camera.ts";
import { VideoSourceDriver } from "./video/source-driver.ts";

const store = new ConfigStore();
const bus = new SignalBus();
const scheduler = new Scheduler(bus);

let audioEngine: AudioEngine | null = null;
let audioBinder: AudioBinder | null = null;
let videoDriver: VideoSourceDriver | null = null;
let camera: CameraResult | null = null;

// ─── DOM refs ────────────────────────────────────────────────────────────────

const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const outputSel = document.getElementById("output-device-sel") as HTMLSelectElement;
const masterGain = document.getElementById("master-gain") as HTMLInputElement;
const masterGainVal = document.getElementById("master-gain-val") as HTMLSpanElement;
const masterMute = document.getElementById("master-mute") as HTMLInputElement;
const cameraBtn = document.getElementById("camera-btn") as HTMLButtonElement;
const cameraStatus = document.getElementById("camera-status") as HTMLSpanElement;

// ─── Wire master gain/mute to ConfigStore ────────────────────────────────────

masterGain.addEventListener("input", () => {
  const v = Number(masterGain.value);
  store.update((p) => {
    p.master.gainDb = v;
  });
});

masterMute.addEventListener("change", () => {
  store.update((p) => {
    p.master.muted = masterMute.checked;
  });
});

store.subscribe("master.gainDb", (v) => {
  masterGainVal.textContent = `${(v as number).toFixed(1)} dB`;
});
masterGainVal.textContent = `${(store.get("master.gainDb") as number).toFixed(1)} dB`;

// ─── Audio start ─────────────────────────────────────────────────────────────

startBtn.addEventListener("click", async () => {
  if (audioEngine !== null) return;
  startBtn.disabled = true;
  audioEngine = new AudioEngine(store);
  await audioEngine.start();
  audioBinder = new AudioBinder(store, bus, scheduler, audioEngine);
  audioBinder.start();
  scheduler.start();

  // Add a basic voice and one default sink mapping for sanity
  store.update((p) => {
    if (p.voices.length === 0) {
      p.voices.push({ id: "v1", kind: "basic", params: {} });
    }
    if (!p.sinks.some((s) => s.id === "v1.gain")) {
      p.sinks.push(
        { id: "v1.freq", kind: "audio.freq", label: "Freq", signal: null, bias: 0, scale: 0 },
        { id: "v1.gain", kind: "audio.gain", label: "Gain", signal: null, bias: -0.4, scale: 0.5 },
        { id: "v1.detune", kind: "audio.detune", label: "Detune", signal: null, bias: 0, scale: 0 },
      );
    }
    // Recompile after sinks settle (a moment later via subscribe)
  });

  scheduler.setGraph(compileGraph(store.snapshot(), bus));

  await populateOutputDevices();
  startBtn.textContent = "Audio running";
});

outputSel.addEventListener("change", async () => {
  if (outputSel.value) {
    await setOutputDevice(outputSel.value);
  }
});

async function populateOutputDevices(): Promise<void> {
  try {
    const devices = await enumerateOutputDevices();
    outputSel.replaceChildren();
    for (const d of devices) {
      const opt = document.createElement("option");
      opt.value = d.deviceId;
      opt.textContent = d.label || `Output ${d.deviceId.slice(0, 6)}`;
      outputSel.append(opt);
    }
  } catch (err) {
    console.warn("[main] enumerateOutputDevices failed", err);
  }
}

// ─── Camera ──────────────────────────────────────────────────────────────────

cameraBtn.addEventListener("click", async () => {
  if (videoDriver !== null) return;
  cameraBtn.disabled = true;
  cameraStatus.textContent = "requesting...";
  try {
    camera = await startCamera();
    videoDriver = new VideoSourceDriver(bus);
    videoDriver.start(camera);
    cameraStatus.textContent = "running";
    // Recompile so any matrix entries referencing video sources resolve
    scheduler.setGraph(compileGraph(store.snapshot(), bus));
  } catch (err) {
    cameraStatus.textContent = `failed: ${(err as Error).message}`;
    cameraBtn.disabled = false;
  }
});

// Diagnostic: log on first frame
let logged = false;
bus.subscribeFrame(() => {
  if (!logged && bus.sourceCount > 0) {
    logged = true;
    console.log(`[main] first signal frame; ${bus.sourceCount} sources, ${bus.sinkCount} sinks`);
  }
});
