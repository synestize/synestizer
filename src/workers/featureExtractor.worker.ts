// --- Scalar signal state ---
let lastSignals: Record<string, number> = {};
let lastProcessTime = 0;

// --- Thumbnail state ---
const THUMB_W = 80;
const THUMB_H = 45;
let lastThumbY: Float32Array | null = null;

const stdev = (variance: number) => Math.sqrt(Math.max(0, variance));

function generateThumbs(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Record<string, ArrayBuffer> {
  const xRatio = width / THUMB_W;
  const yRatio = height / THUMB_H;

  const brightBuf    = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const cbBuf        = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const crBuf        = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const corrBuf      = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const motionBuf    = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const xProfileBuf  = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);
  const yProfileBuf  = new Uint8ClampedArray(THUMB_W * THUMB_H * 4);

  const currentThumbY = new Float32Array(THUMB_W * THUMB_H);
  const colAvg = new Float32Array(THUMB_W);
  const rowAvg = new Float32Array(THUMB_H);

  for (let ty = 0; ty < THUMB_H; ty++) {
    for (let tx = 0; tx < THUMB_W; tx++) {
      const sx = Math.min(width - 1, Math.floor(tx * xRatio));
      const sy = Math.min(height - 1, Math.floor(ty * yRatio));
      const si = (sy * width + sx) * 4;
      const r = data[si], g = data[si + 1], b = data[si + 2];

      const yLuma = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const cbShift = cb - 128;
      const crShift = cr - 128;

      const ti = (ty * THUMB_W + tx) * 4;
      currentThumbY[ty * THUMB_W + tx] = yLuma;

      // Grayscale luminance
      brightBuf[ti] = brightBuf[ti + 1] = brightBuf[ti + 2] = yLuma;
      brightBuf[ti + 3] = 255;

      // Chroma blue: blue tones = high Cb, warm orange = low Cb
      cbBuf[ti]     = Math.max(0, Math.min(255, 128 - cbShift));
      cbBuf[ti + 1] = Math.max(0, Math.min(255, 128 - cbShift * 0.5));
      cbBuf[ti + 2] = Math.max(0, Math.min(255, 128 + cbShift));
      cbBuf[ti + 3] = 255;

      // Chroma red: red tones = high Cr, teal = low Cr
      crBuf[ti]     = Math.max(0, Math.min(255, 128 + crShift));
      crBuf[ti + 1] = Math.max(0, Math.min(255, 128 - crShift * 0.5));
      crBuf[ti + 2] = Math.max(0, Math.min(255, 128 - crShift));
      crBuf[ti + 3] = 255;

      // Brightness↔blue correlation: Y drives green, Cb bias drives blue/red
      corrBuf[ti]     = Math.max(0, Math.min(255, 128 - cbShift * 0.5));
      corrBuf[ti + 1] = Math.max(0, Math.min(255, yLuma * 0.7));
      corrBuf[ti + 2] = Math.max(0, Math.min(255, 128 + cbShift * 0.5));
      corrBuf[ti + 3] = 255;

      // Motion: amplified frame difference
      if (lastThumbY) {
        const diff = Math.min(255, Math.abs(yLuma - lastThumbY[ty * THUMB_W + tx]) * 4);
        motionBuf[ti]     = diff;
        motionBuf[ti + 1] = diff * 0.4;
        motionBuf[ti + 2] = 0;
      }
      motionBuf[ti + 3] = 255;

      colAvg[tx] += yLuma / THUMB_H;
      rowAvg[ty] += yLuma / THUMB_W;
    }
  }

  // Horizontal profile: column brightness as bar chart (bottom-up)
  for (let ty = 0; ty < THUMB_H; ty++) {
    for (let tx = 0; tx < THUMB_W; tx++) {
      const ti = (ty * THUMB_W + tx) * 4;
      const level = colAvg[tx];
      const barTop = THUMB_H - Math.round((level / 255) * THUMB_H);
      const filled = ty >= barTop;
      xProfileBuf[ti]     = filled ? Math.min(255, level * 1.2) : 20;
      xProfileBuf[ti + 1] = filled ? Math.min(255, level)       : 20;
      xProfileBuf[ti + 2] = filled ? Math.min(255, level * 0.4) : 20;
      xProfileBuf[ti + 3] = 255;
    }
  }

  // Vertical profile: row brightness as bar chart (left-to-right)
  for (let ty = 0; ty < THUMB_H; ty++) {
    for (let tx = 0; tx < THUMB_W; tx++) {
      const ti = (ty * THUMB_W + tx) * 4;
      const level = rowAvg[ty];
      const barRight = Math.round((level / 255) * THUMB_W);
      const filled = tx <= barRight;
      yProfileBuf[ti]     = filled ? Math.min(255, level * 0.4) : 20;
      yProfileBuf[ti + 1] = filled ? Math.min(255, level)       : 20;
      yProfileBuf[ti + 2] = filled ? Math.min(255, level * 1.2) : 20;
      yProfileBuf[ti + 3] = 255;
    }
  }

  lastThumbY = currentThumbY;

  return {
    brightness:           brightBuf.buffer,
    chroma_blue:          cbBuf.buffer,
    chroma_red:           crBuf.buffer,
    brightness_blue_corr: corrBuf.buffer,
    motion:               motionBuf.buffer,
    x_brightness:         xProfileBuf.buffer,
    y_brightness:         yProfileBuf.buffer,
  };
}

self.onmessage = (event: MessageEvent<{ data: ArrayBuffer; width: number; height: number }>) => {
  const data = new Uint8ClampedArray(event.data.data);
  const { width, height } = event.data;
  const pixelCount = width * height;

  // --- 1. Raw Moment Calculation ---
  const sums = {
    y: 0, cb: 0, cr: 0,
    x_y: 0, x_cb: 0, x_cr: 0,
    y_y: 0, y_cb: 0, y_cr: 0,
    y_x: 0, cb_x: 0, cr_x: 0,
    cb_cb: 0, cb_cr: 0,
    cr_cr: 0,
  };

  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    const y  = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    const xNorm = (i % width) / width;
    const yNorm = Math.floor(i / width) / height;

    sums.y  += y;
    sums.cb += cb;
    sums.cr += cr;

    sums.y_y   += y * y;
    sums.cb_cb += cb * cb;
    sums.cr_cr += cr * cr;

    sums.y_cb  += y * cb;
    sums.y_cr  += y * cr;
    sums.cb_cr += cb * cr;
    sums.x_y   += xNorm * y;
    sums.x_cb  += xNorm * cb;
    sums.x_cr  += xNorm * cr;
    sums.y_x   += yNorm * y;
  }

  // --- 2. Central Moment Calculation ---
  const means = {
    y: sums.y / pixelCount,
    cb: sums.cb / pixelCount,
    cr: sums.cr / pixelCount,
    x: 0.5,
    y_coord: 0.5,
  };

  const variances = {
    y:       (sums.y_y   / pixelCount) - (means.y  ** 2),
    cb:      (sums.cb_cb / pixelCount) - (means.cb ** 2),
    cr:      (sums.cr_cr / pixelCount) - (means.cr ** 2),
    x:       1 / 12,
    y_coord: 1 / 12,
  };

  const covariances = {
    x_y:     (sums.x_y / pixelCount) - (means.x     * means.y),
    x_cb:    (sums.x_cb / pixelCount) - (means.x     * means.cb),
    x_cr:    (sums.x_cr / pixelCount) - (means.x     * means.cr),
    y_y_coord: (sums.y_x / pixelCount) - (means.y_coord * means.y),
    y_cb:    (sums.y_cb / pixelCount) - (means.y     * means.cb),
    y_cr:    (sums.y_cr / pixelCount) - (means.y     * means.cr),
    cb_cr:   (sums.cb_cr / pixelCount) - (means.cb   * means.cr),
  };

  // --- 3. Signal Generation ---
  const currentSignals = {
    brightness:            means.y / 255,
    chroma_blue:           means.cb / 255,
    chroma_red:            means.cr / 255,
    brightness_variance:   stdev(variances.y) / 64,
    chroma_blue_variance:  stdev(variances.cb) / 64,
    chroma_red_variance:   stdev(variances.cr) / 64,
    x_brightness:         (covariances.x_y / (stdev(variances.x) * stdev(variances.y))) * 2,
    y_brightness:         (covariances.y_y_coord / (stdev(variances.y_coord) * stdev(variances.y))) * 2,
    brightness_blue_corr: (covariances.y_cb / (stdev(variances.y) * stdev(variances.cb))),
  };

  // --- 4. Delta Signals ---
  const now = Date.now();
  const deltaTime = (now - lastProcessTime) / 1000.0;
  lastProcessTime = now;
  const deltaSignals: Record<string, number> = {};
  for (const key in currentSignals) {
    const lastVal = lastSignals[key] || 0;
    const currentVal = currentSignals[key as keyof typeof currentSignals];
    deltaSignals[`${key}_delta`] = Math.max(0, (currentVal - lastVal) / deltaTime) * 5;
  }

  lastSignals = currentSignals;

  // --- 5. Generate Thumbnails ---
  const thumbs = generateThumbs(data, width, height);

  const signals = { ...currentSignals, ...deltaSignals };
  const transfer: Transferable[] = [
    thumbs.brightness, thumbs.chroma_blue, thumbs.chroma_red,
    thumbs.brightness_blue_corr, thumbs.motion,
    thumbs.x_brightness, thumbs.y_brightness,
  ];
  self.postMessage({ signals, thumbs }, { transfer });
};
