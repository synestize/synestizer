// State to be stored within the worker's scope
let lastSignals = { brightness: 0, red: 0, blue: 0 };
let lastProcessTime = 0;

self.onmessage = (event: MessageEvent<ImageData>) => {
  const imageData = event.data;
  const data = imageData.data;
  let totalBrightness = 0;
  let totalRed = 0;
  let totalBlue = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
    totalRed += Math.max(0, r - (g + b) / 2);
    totalBlue += Math.max(0, b - (r + g) / 2);
  }

  // --- 1. Calculate current raw signals ---
  const currentSignals = {
    brightness: (totalBrightness / pixelCount) / 255,
    red: (totalRed / pixelCount) / 128,
    blue: (totalBlue / pixelCount) / 128,
  };

  // --- 2. Calculate delta (derivative) signals ---
  const now = Date.now();
  const deltaTime = (now - lastProcessTime) / 1000.0; // time in seconds
  lastProcessTime = now;

  // Calculate change and normalize by time. The factor of 5 is a sensitivity boost.
  const deltaSignals = {
    brightness_delta: Math.max(0, (currentSignals.brightness - lastSignals.brightness) / deltaTime) * 5,
    red_delta: Math.max(0, (currentSignals.red - lastSignals.red) / deltaTime) * 5,
    blue_delta: Math.max(0, (currentSignals.blue - lastSignals.blue) / deltaTime) * 5,
  };

  // --- 3. Calculate power signals ---
  const powerSignals = {
    brightness_power: currentSignals.brightness ** 2,
    red_power: currentSignals.red ** 2,
    blue_power: currentSignals.blue ** 2,
  };

  // --- 4. Update state for next frame ---
  lastSignals = currentSignals;

  // --- 5. Post all signals back to the main thread ---
  self.postMessage({
    ...currentSignals,
    ...deltaSignals,
    ...powerSignals,
  });
};