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

    // RGB to Brightness (Luma) and simplified Chroma
    totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
    totalRed += Math.max(0, r - (g + b) / 2); // Measures redness vs the average of green/blue
    totalBlue += Math.max(0, b - (r + g) / 2); // Measures blueness vs the average of red/green
  }

  // Normalize all values to a 0-1 range
  const avgBrightness = (totalBrightness / pixelCount) / 255;
  const avgRed = (totalRed / pixelCount) / 128; // Heuristic normalization
  const avgBlue = (totalBlue / pixelCount) / 128; // Heuristic normalization

  // Post the result object back to the main thread
  self.postMessage({
    brightness: avgBrightness,
    red: avgRed,
    blue: avgBlue
  });
};