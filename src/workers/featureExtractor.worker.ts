// --- State stored within the worker's scope ---
let lastSignals: Record<string, number> = {};
let lastProcessTime = 0;

// Helper function for statistical normalization
const stdev = (variance: number) => Math.sqrt(Math.max(0, variance));

self.onmessage = (event: MessageEvent<ImageData>) => {
  const { data, width, height } = event.data;
  const pixelCount = width * height;

  // --- 1. Raw Moment Calculation ---
  // These will store the sums of various values over all pixels.
  const sums = {
    y: 0, cb: 0, cr: 0, // Mean values for Y, Cb, Cr
    x_y: 0, x_cb: 0, x_cr: 0, // Spatial correlation with X
    y_y: 0, y_cb: 0, y_cr: 0, // Covariance between channels
    y_x: 0, cb_x: 0, cr_x: 0, // Spatial correlation with Y (same as x_y etc, but good to be explicit)
    cb_cb: 0, cb_cr: 0,
    cr_cr: 0,
  };

  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    // --- RGB to YCbCr conversion (approximated) ---
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    // Spatial coordinates, normalized from 0 to 1
    const xNorm = (i % width) / width;
    const yNorm = Math.floor(i / width) / height;

    // Accumulate sums for calculating means
    sums.y += y;
    sums.cb += cb;
    sums.cr += cr;

    // Accumulate sums for calculating variances
    sums.y_y += y * y;
    sums.cb_cb += cb * cb;
    sums.cr_cr += cr * cr;

    // Accumulate sums for covariances
    sums.y_cb += y * cb;
    sums.y_cr += y * cr;
    sums.cb_cr += cb * cr;
    sums.x_y += xNorm * y;
    sums.x_cb += xNorm * cb;
    sums.x_cr += xNorm * cr;
    sums.y_x += yNorm * y; // Note: 'y_x' here means y-coordinate vs y-luma
    // ... we can add y_cb, y_cr here if we want vertical correlation
  }

  // --- 2. Central Moment Calculation ---
  const means = {
    y: sums.y / pixelCount,
    cb: sums.cb / pixelCount,
    cr: sums.cr / pixelCount,
    x: 0.5, // The mean of a uniform distribution from 0 to 1
    y_coord: 0.5,
  };

  const variances = {
    y: (sums.y_y / pixelCount) - (means.y ** 2),
    cb: (sums.cb_cb / pixelCount) - (means.cb ** 2),
    cr: (sums.cr_cr / pixelCount) - (means.cr ** 2),
    x: 1 / 12, // The variance of a uniform distribution from 0 to 1
    y_coord: 1 / 12,
  };

  const covariances = {
    x_y: (sums.x_y / pixelCount) - (means.x * means.y),
    x_cb: (sums.x_cb / pixelCount) - (means.x * means.cb),
    x_cr: (sums.x_cr / pixelCount) - (means.x * means.cr),
    y_y_coord: (sums.y_x / pixelCount) - (means.y_coord * means.y),
    y_cb: (sums.y_cb / pixelCount) - (means.y * means.cb),
    y_cr: (sums.y_cr / pixelCount) - (means.y * means.cr),
    cb_cr: (sums.cb_cr / pixelCount) - (means.cb * means.cr),
  };

  // --- 3. Final Signal Generation & Normalization ---
  // We now have enough to generate a rich set of signals.
  const currentSignals = {
    // Mean Values (normalized)
    brightness: means.y / 255,
    chroma_blue: means.cb / 255,
    chroma_red: means.cr / 255,
    // Variance (normalized standard deviation)
    brightness_variance: stdev(variances.y) / 64, // Heuristic normalization
    chroma_blue_variance: stdev(variances.cb) / 64,
    chroma_red_variance: stdev(variances.cr) / 64,
    // Correlations (inherently -1 to 1, but we scale for sensitivity)
    x_brightness: (covariances.x_y / (stdev(variances.x) * stdev(variances.y))) * 2,
    y_brightness: (covariances.y_y_coord / (stdev(variances.y_coord) * stdev(variances.y))) * 2,
    brightness_blue_corr: (covariances.y_cb / (stdev(variances.y) * stdev(variances.cb))),
  };

  // --- 4. Calculate Deltas ---
  const now = Date.now();
  const deltaTime = (now - lastProcessTime) / 1000.0;
  lastProcessTime = now;
  const deltaSignals: Record<string, number> = {};
  for (const key in currentSignals) {
    const lastVal = lastSignals[key] || 0;
    const currentVal = currentSignals[key as keyof typeof currentSignals];
    deltaSignals[`${key}_delta`] = Math.max(0, (currentVal - lastVal) / deltaTime) * 5;
  }

  // --- 5. Update state and post ---
  lastSignals = currentSignals;
  self.postMessage({ ...currentSignals, ...deltaSignals });
};