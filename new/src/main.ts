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
import { playablePreset } from "./preset/defaults.ts";
import { SignalBus } from "./signal/bus.ts";
import { compileGraph } from "./signal/graph.ts";
import { Scheduler } from "./signal/scheduler.ts";
import { ConfigStore } from "./store/config-store.ts";
import "./ui/components/syn-meter.ts";
import "./ui/components/syn-patch-matrix.ts";
import "./ui/components/syn-preset-widget.ts";
import "./ui/components/syn-sinks-panel.ts";
import "./ui/components/syn-source-picker.ts";
import type { SynPatchMatrix } from "./ui/components/syn-patch-matrix.ts";
import type { SynPresetWidget } from "./ui/components/syn-preset-widget.ts";
import type { SynSinksPanel } from "./ui/components/syn-sinks-panel.ts";
import type { SynSourcePicker } from "./ui/components/syn-source-picker.ts";
import { LiveUI } from "./ui/live-ui.ts";
import { type CameraResult, startCamera } from "./video/camera.ts";
import { VideoSourceDriver } from "./video/source-driver.ts";

const store = new ConfigStore(playablePreset());
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
  scheduler.setGraph(compileGraph(store.snapshot(), bus));
  liveUI.refresh();
  sinksPanel.refresh();
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

const previewMount = document.getElementById("camera-preview-mount") as HTMLElement;

cameraBtn.addEventListener("click", async () => {
  if (videoDriver !== null) return;
  cameraBtn.disabled = true;
  cameraStatus.textContent = "requesting...";
  try {
    camera = await startCamera();
    // Show the live camera feed so user can confirm frames are flowing.
    // The videoEl was play()'d while detached; some browsers pause it on
    // re-attach, so force play after appending. Errors here are non-fatal —
    // the worker pump uses the same element regardless.
    previewMount.replaceChildren(camera.videoEl);
    camera.videoEl.play().catch((e) => console.warn("[main] preview play failed", e));
    videoDriver = new VideoSourceDriver(bus);
    videoDriver.start(camera);
    cameraStatus.textContent = "running";
    // Recompile so any matrix entries referencing video sources resolve
    scheduler.setGraph(compileGraph(store.snapshot(), bus));
    liveUI.refresh();
    patchMatrix.refreshSourceSlots();
    sinksPanel.refresh();
    sourcePicker.refresh();
  } catch (err) {
    cameraStatus.textContent = `failed: ${(err as Error).message}`;
    cameraBtn.disabled = false;
  }
});

// ─── Live UI panels (meters + matrix sliders) ────────────────────────────────

const liveUI = new LiveUI({
  store,
  bus,
  scheduler,
  genericContainer: document.getElementById("generic-meters") as HTMLElement,
  sourceContainer: document.getElementById("source-meters") as HTMLElement,
  sinkContainer: document.getElementById("sink-meters") as HTMLElement,
  matrixContainer: document.getElementById("matrix-rows") as HTMLElement,
});
liveUI.start();

// ─── Stage 5 UI: <syn-patch-matrix> ──────────────────────────────────────────

const patchMatrix = document.getElementById("patch-matrix") as SynPatchMatrix;
patchMatrix.configure({
  store,
  bus,
  onScaleChange: () => {
    // Recompile the graph so the change takes effect on the next tick.
    scheduler.setGraph(compileGraph(store.snapshot(), bus));
  },
});

const sinksPanel = document.getElementById("sinks-panel") as SynSinksPanel;
sinksPanel.configure({
  store,
  bus,
  onChange: () => {
    scheduler.setGraph(compileGraph(store.snapshot(), bus));
  },
});

const sourcePicker = document.getElementById("source-picker") as SynSourcePicker;
sourcePicker.configure({
  store,
  bus,
  onAdd: () => {
    scheduler.setGraph(compileGraph(store.snapshot(), bus));
  },
});

const presetWidget = document.getElementById("preset-widget") as SynPresetWidget;
presetWidget.configure({ store });

// Loading a preset can change voices/sinks/matrix; recompile + refresh meters.
store.subscribe("**", () => {
  scheduler.setGraph(compileGraph(store.snapshot(), bus));
});

// Diagnostic: log on first frame
let logged = false;
bus.subscribeFrame(() => {
  if (!logged && bus.sourceCount > 0) {
    logged = true;
    console.log(`[main] first signal frame; ${bus.sourceCount} sources, ${bus.sinkCount} sinks`);
  }
});
